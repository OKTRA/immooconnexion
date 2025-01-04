import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionLimits {
  max_properties: number
  max_tenants: number
  max_users: number
  current_properties: number
  current_tenants: number
  current_users: number
}

export function useSubscriptionLimits(agencyId: string) {
  const { toast } = useToast()

  const { data: limits } = useQuery({
    queryKey: ["subscription-limits", agencyId],
    queryFn: async () => {
      // Récupérer l'agence et son plan actuel
      const { data: agency } = await supabase
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

      if (!agency) throw new Error("Agency not found")

      return {
        max_properties: agency.subscription_plans?.max_properties ?? -1,
        max_tenants: agency.subscription_plans?.max_tenants ?? -1,
        max_users: agency.subscription_plans?.max_users ?? -1,
        current_properties: agency.current_properties_count ?? 0,
        current_tenants: agency.current_tenants_count ?? 0,
        current_users: agency.current_profiles_count ?? 0
      }
    },
    enabled: !!agencyId
  })

  const checkDowngradeEligibility = (planLimits: {
    max_properties: number
    max_tenants: number
    max_users: number
  }) => {
    if (!limits) return false

    const exceedsProperties = planLimits.max_properties !== -1 && 
      limits.current_properties > planLimits.max_properties
    
    const exceedsTenants = planLimits.max_tenants !== -1 && 
      limits.current_tenants > planLimits.max_tenants
    
    const exceedsUsers = planLimits.max_users !== -1 && 
      limits.current_users > planLimits.max_users

    return !exceedsProperties && !exceedsTenants && !exceedsUsers
  }

  const checkLimitReached = async (type: 'property' | 'tenant' | 'user') => {
    if (!limits) return false

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
      }
    })()

    if (isLimitReached) {
      const typeLabel = type === 'property' ? 'propriétés' : 
        type === 'tenant' ? 'locataires' : 'utilisateurs'
      
      toast({
        title: "Limite atteinte",
        description: `Vous avez atteint la limite de ${typeLabel} pour votre plan actuel. Veuillez mettre à niveau votre abonnement pour en ajouter davantage.`,
        variant: "destructive"
      })
      return true
    }

    return false
  }

  return {
    limits,
    checkDowngradeEligibility,
    checkLimitReached
  }
}