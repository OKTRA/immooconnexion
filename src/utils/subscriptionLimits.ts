import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export interface SubscriptionLimits {
  max_properties: number
  max_tenants: number
}

export async function checkSubscriptionLimits(agencyId: string, type: 'property' | 'tenant'): Promise<boolean> {
  try {
    // Get agency's subscription plan
    const { data: agency } = await supabase
      .from('agencies')
      .select('subscription_plan_id')
      .eq('id', agencyId)
      .single()

    if (!agency?.subscription_plan_id) {
      console.error('No subscription plan found for agency')
      return false
    }

    // Get subscription plan limits
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('max_properties, max_tenants')
      .eq('id', agency.subscription_plan_id)
      .single()

    if (!plan) {
      console.error('Subscription plan not found')
      return false
    }

    // Get current counts
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId)

    const { count: tenantsCount } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId)

    if (type === 'property' && plan.max_properties !== -1) {
      return (propertiesCount || 0) < plan.max_properties
    }

    if (type === 'tenant' && plan.max_tenants !== -1) {
      return (tenantsCount || 0) < plan.max_tenants
    }

    return true
  } catch (error) {
    console.error('Error checking subscription limits:', error)
    return false
  }
}

export function useSubscriptionLimits() {
  const { toast } = useToast()

  const checkAndNotifyLimits = async (agencyId: string, type: 'property' | 'tenant'): Promise<boolean> => {
    const canAdd = await checkSubscriptionLimits(agencyId, type)
    
    if (!canAdd) {
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${type === 'property' ? 'biens' : 'locataires'} de votre forfait. Veuillez mettre à niveau votre abonnement.`,
        variant: "destructive",
      })
    }
    
    return canAdd
  }

  return { checkAndNotifyLimits }
}