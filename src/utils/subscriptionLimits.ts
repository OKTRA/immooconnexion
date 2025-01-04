import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export async function checkSubscriptionLimits(agencyId: string, type: 'property' | 'tenant' | 'user'): Promise<boolean> {
  try {
    console.log("Checking limits for agency:", agencyId, "type:", type)
    
    // Get agency's subscription plan and current counts
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .select(`
        id,
        subscription_plan_id,
        current_properties_count,
        current_tenants_count,
        current_profiles_count,
        subscription_plans (
          id,
          name,
          max_properties,
          max_tenants,
          max_users,
          features
        )
      `)
      .eq('id', agencyId)
      .single()

    if (agencyError) {
      console.error('Error fetching agency:', agencyError)
      return false
    }

    if (!agency?.subscription_plans) {
      console.error('No subscription plan found for agency')
      return false
    }

    console.log("Agency details:", {
      plan: agency.subscription_plans,
      currentCounts: {
        properties: agency.current_properties_count,
        tenants: agency.current_tenants_count,
        users: agency.current_profiles_count
      }
    })

    const plan = agency.subscription_plans
    
    // Check limits based on type
    switch (type) {
      case 'property':
        // -1 means unlimited
        if (plan.max_properties === -1) return true
        // Make sure we use 0 if the count is null
        const currentProperties = agency.current_properties_count || 0
        return currentProperties < plan.max_properties
        
      case 'tenant':
        if (plan.max_tenants === -1) return true
        const currentTenants = agency.current_tenants_count || 0
        return currentTenants < plan.max_tenants
        
      case 'user':
        if (plan.max_users === -1) return true
        const currentUsers = agency.current_profiles_count || 0
        return currentUsers < plan.max_users
        
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
      const { data: agency } = await supabase
        .from('agencies')
        .select(`
          current_properties_count,
          current_tenants_count,
          current_profiles_count,
          subscription_plans (
            max_properties,
            max_tenants,
            max_users
          )
        `)
        .eq('id', agencyId)
        .single()

      if (agency) {
        const typeLabel = type === 'property' ? 'biens' : 
                         type === 'tenant' ? 'locataires' : 
                         'utilisateurs'
        
        const currentValue = type === 'property' ? agency.current_properties_count :
          type === 'tenant' ? agency.current_tenants_count :
          agency.current_profiles_count

        const maxValue = type === 'property' ? agency.subscription_plans?.max_properties :
          type === 'tenant' ? agency.subscription_plans?.max_tenants :
          agency.subscription_plans?.max_users
        
        toast({
          title: "Limite atteinte",
          description: `Vous avez atteint la limite de ${typeLabel} pour votre plan actuel (${currentValue || 0}/${maxValue}). Veuillez mettre à niveau votre abonnement pour en ajouter davantage.`,
          variant: "destructive"
        })
      }
      return false
    }
    
    return true
  }

  return { checkAndNotifyLimits }
}