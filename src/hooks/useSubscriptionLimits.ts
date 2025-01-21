import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SubscriptionPlan } from "@/types/subscription"

export function useSubscriptionLimits(agencyId?: string) {
  const { toast } = useToast()

  const { data: limits } = useQuery({
    queryKey: ["subscription-limits", agencyId],
    queryFn: async () => {
      console.log("Fetching limits for agency:", agencyId)
      
      const { data: agency, error } = await supabase
        .from("agencies")
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
        .eq("id", agencyId)
        .single()

      if (error) {
        console.error("Error fetching agency limits:", error)
        throw error
      }

      if (!agency?.subscription_plans) {
        console.error("No subscription plan found for agency")
        throw new Error("No subscription plan found")
      }

      const plan = agency.subscription_plans as SubscriptionPlan

      return {
        max_properties: plan.max_properties,
        max_tenants: plan.max_tenants,
        max_users: plan.max_users,
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
      return true
    }

    console.log("Checking limit for type:", type, "Current limits:", limits)

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
      
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${typeLabel} pour votre plan actuel.`,
        variant: "destructive"
      })
      return true
    }

    return false
  }

  return {
    limits,
    checkLimitReached
  }
}