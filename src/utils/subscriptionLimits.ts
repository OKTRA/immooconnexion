import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface SubscriptionLimits {
  max_properties: number
  max_tenants: number
  max_users: number
}

export async function checkSubscriptionLimits(agencyId: string, type: 'property' | 'tenant' | 'user'): Promise<boolean> {
  try {
    console.log("Checking limits for agency:", agencyId, "type:", type)
    
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

    // Get subscription plan limits and features
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('max_properties, max_tenants, max_users, features, name')
      .eq('id', agency.subscription_plan_id)
      .single()

    if (!plan) {
      console.error('Subscription plan not found')
      return false
    }

    console.log("Plan details:", plan)

    // Check if plan allows sales management
    if (type === 'property' && !plan.features.includes('Gestion des ventes de biens')) {
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

    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId)

    console.log("Current counts:", {
      properties: propertiesCount,
      tenants: tenantsCount,
      users: usersCount
    })

    // Basic/Free plan specific logic - simplified
    if (plan.name.toLowerCase().includes('basic') || plan.name.toLowerCase().includes('gratuit')) {
      console.log("Basic/Free plan detected")
      
      // For properties, allow exactly one
      if (type === 'property') {
        const currentCount = propertiesCount || 0
        console.log(`Current properties count: ${currentCount}`)
        return currentCount === 0
      }
      
      // For other types, maintain the same logic
      if (type === 'tenant') return (tenantsCount || 0) < 1
      if (type === 'user') return (usersCount || 0) < 1
      return false
    }

    // For other plans, check against max limits
    switch (type) {
      case 'property':
        return plan.max_properties === -1 || (propertiesCount || 0) < plan.max_properties
      case 'tenant':
        return plan.max_tenants === -1 || (tenantsCount || 0) < plan.max_tenants
      case 'user':
        return plan.max_users === -1 || (usersCount || 0) < plan.max_users
      default:
        return false
    }
  } catch (error) {
    console.error('Error checking subscription limits:', error)
    return false
  }
}

export function useSubscriptionLimits() {
  const { toast } = useToast()

  const checkAndNotifyLimits = async (agencyId: string, type: 'property' | 'tenant' | 'user'): Promise<boolean> => {
    const canAdd = await checkSubscriptionLimits(agencyId, type)
    
    if (!canAdd) {
      const typeLabel = type === 'property' ? 'biens' : type === 'tenant' ? 'locataires' : 'utilisateurs'
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${typeLabel} pour votre plan actuel. Veuillez mettre à niveau votre abonnement pour ajouter plus de ${typeLabel}.`,
        variant: "destructive",
      })
    }
    
    return canAdd
  }

  return { checkAndNotifyLimits }
}