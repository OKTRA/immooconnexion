import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export async function checkSubscriptionLimits(agencyId: string, type: 'property' | 'tenant' | 'user'): Promise<boolean> {
  try {
    console.log("🔍 Checking limits for agency:", agencyId, "type:", type)
    
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
      console.error('❌ Error fetching agency:', agencyError)
      return false
    }

    if (!agency?.subscription_plans) {
      console.error('❌ No subscription plan found for agency')
      return false
    }

    console.log("📊 Agency details:", {
      plan: agency.subscription_plans,
      currentCounts: {
        properties: agency.current_properties_count,
        tenants: agency.current_tenants_count,
        users: agency.current_profiles_count
      }
    })

    // Check limits based on type
    let canAdd = false
    switch (type) {
      case 'property':
        // -1 means unlimited
        if (agency.subscription_plans.max_properties === -1) {
          console.log("✅ Unlimited properties allowed")
          canAdd = true
        } else {
          canAdd = agency.current_properties_count < agency.subscription_plans.max_properties
          console.log("📝 Property limits check:", {
            current: agency.current_properties_count,
            max: agency.subscription_plans.max_properties,
            canAdd
          })
        }
        break
        
      case 'tenant':
        if (agency.subscription_plans.max_tenants === -1) {
          console.log("✅ Unlimited tenants allowed")
          canAdd = true
        } else {
          canAdd = agency.current_tenants_count < agency.subscription_plans.max_tenants
          console.log("👥 Tenant limits check:", {
            current: agency.current_tenants_count,
            max: agency.subscription_plans.max_tenants,
            canAdd
          })
        }
        break
        
      case 'user':
        if (agency.subscription_plans.max_users === -1) {
          console.log("✅ Unlimited users allowed")
          canAdd = true
        } else {
          canAdd = agency.current_profiles_count < agency.subscription_plans.max_users
          console.log("👤 User limits check:", {
            current: agency.current_profiles_count,
            max: agency.subscription_plans.max_users,
            canAdd
          })
        }
        break
    }

    console.log(`${canAdd ? '✅' : '❌'} Can add ${type}:`, canAdd)
    return canAdd

  } catch (error) {
    console.error('❌ Error checking subscription limits:', error)
    return false
  }
}

export function useSubscriptionLimits() {
  const { toast } = useToast()

  const checkAndNotifyLimits = async (agencyId: string, type: 'property' | 'tenant' | 'user'): Promise<boolean> => {
    console.log("🔄 Starting limit check for:", { agencyId, type })
    
    const canAdd = await checkSubscriptionLimits(agencyId, type)
    console.log("📋 Result of limit check:", canAdd)
    
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
        
        console.log("❌ Limit reached details:", {
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