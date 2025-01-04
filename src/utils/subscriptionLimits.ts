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

    const plan = agency.subscription_plans
    const currentCounts = {
      properties: agency.current_properties_count || 0,
      tenants: agency.current_tenants_count || 0,
      users: agency.current_profiles_count || 0
    }

    console.log("Agency details:", {
      plan,
      currentCounts,
      agencyId
    })

    // Check limits based on type
    switch (type) {
      case 'property':
        // -1 means unlimited
        if (plan.max_properties === -1) {
          console.log("Unlimited properties allowed")
          return true
        }
        console.log("Property limits check:", {
          current: currentCounts.properties,
          max: plan.max_properties,
          canAdd: currentCounts.properties < plan.max_properties
        })
        return currentCounts.properties < plan.max_properties
        
      case 'tenant':
        if (plan.max_tenants === -1) {
          console.log("Unlimited tenants allowed")
          return true
        }
        console.log("Tenant limits check:", {
          current: currentCounts.tenants,
          max: plan.max_tenants,
          canAdd: currentCounts.tenants < plan.max_tenants
        })
        return currentCounts.tenants < plan.max_tenants
        
      case 'user':
        if (plan.max_users === -1) {
          console.log("Unlimited users allowed")
          return true
        }
        console.log("User limits check:", {
          current: currentCounts.users,
          max: plan.max_users,
          canAdd: currentCounts.users < plan.max_users
        })
        return currentCounts.users < plan.max_users
        
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
            max_users,
            name
          )
        `)
        .eq('id', agencyId)
        .single()

      if (agency) {
        const currentCounts = {
          property: agency.current_properties_count || 0,
          tenant: agency.current_tenants_count || 0,
          user: agency.current_profiles_count || 0
        }

        const maxValues = {
          property: agency.subscription_plans?.max_properties,
          tenant: agency.subscription_plans?.max_tenants,
          user: agency.subscription_plans?.max_users
        }

        const typeLabels = {
          property: 'biens',
          tenant: 'locataires',
          user: 'utilisateurs'
        }
        
        console.log("Limit reached details:", {
          type,
          currentValue: currentCounts[type],
          maxValue: maxValues[type],
          plan: agency.subscription_plans?.name
        })
        
        toast({
          title: "Limite atteinte",
          description: `Vous avez atteint la limite de ${typeLabels[type]} pour votre plan ${agency.subscription_plans?.name} (${currentCounts[type]}/${maxValues[type]}). Veuillez mettre à niveau votre abonnement pour en ajouter davantage.`,
          variant: "destructive"
        })
      }
      return false
    }
    
    return true
  }

  return { checkAndNotifyLimits }
}