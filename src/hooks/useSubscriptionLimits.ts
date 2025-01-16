import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/integrations/supabase/client"

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']

export function useSubscriptionLimits(agencyId?: string) {
  const { toast } = useToast()

  const { data: limits } = useQuery({
    queryKey: ["subscription-limits", agencyId],
    queryFn: async () => {
      if (!agencyId) return null

      const { data: agency, error } = await supabase
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

      if (error) {
        console.error("Error fetching agency limits:", error)
        throw error
      }

      if (!agency?.subscription_plans) {
        console.error("No subscription plan found for agency")
        throw new Error("No subscription plan found")
      }

      return {
        max_properties: agency.subscription_plans.max_properties,
        max_tenants: agency.subscription_plans.max_tenants,
        max_users: agency.subscription_plans.max_users,
        current_properties: agency.current_properties_count || 0,
        current_tenants: agency.current_tenants_count || 0,
        current_users: agency.current_profiles_count || 0
      }
    },
    enabled: !!agencyId
  })

  const checkLimitReached = async (type: 'property' | 'tenant' | 'user') => {
    if (!limits) {
      console.log("No limits data available")
      return true // Block operation if limits are not available
    }

    const isLimitReached = (() => {
      switch (type) {
        case 'property':
          return limits.max_properties !== -1 && 
            limits.current_properties >= limits.max_properties
        case 'tenant':
          return limits.max_tenants !== -1 && 
            limits.current_tenants >= limits.max_tenants
        case 'user':
          return limits.max_users !== -1 && 
            limits.current_users >= limits.max_users
        default:
          return true
      }
    })()

    if (isLimitReached) {
      const typeLabel = type === 'property' ? 'propriétés' : 
        type === 'tenant' ? 'locataires' : 'utilisateurs'
      
      const currentValue = type === 'property' ? limits.current_properties :
        type === 'tenant' ? limits.current_tenants :
        limits.current_users

      const maxValue = type === 'property' ? limits.max_properties :
        type === 'tenant' ? limits.max_tenants :
        limits.max_users
      
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${typeLabel} pour votre plan actuel (${currentValue}/${maxValue}). Veuillez mettre à niveau votre abonnement pour en ajouter davantage.`,
        variant: "destructive"
      })
      return true
    }

    return false
  }

  const checkDowngradeEligibility = (planLimits: {
    max_properties: number
    max_tenants: number
    max_users: number
  }) => {
    if (!limits) {
      console.log("No limits data available")
      return false
    }

    const exceedsProperties = planLimits.max_properties !== -1 && 
      limits.current_properties > planLimits.max_properties
    
    const exceedsTenants = planLimits.max_tenants !== -1 && 
      limits.current_tenants > planLimits.max_tenants
    
    const exceedsUsers = planLimits.max_users !== -1 && 
      limits.current_users > planLimits.max_users

    const canDowngrade = !exceedsProperties && !exceedsTenants && !exceedsUsers

    return canDowngrade
  }

  return {
    limits,
    checkDowngradeEligibility,
    checkLimitReached
  }
}