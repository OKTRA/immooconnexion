import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useApartmentTenants(apartmentId: string) {
  return useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      const { data, error } = await supabase
        .from('apartment_tenants')
        .select('*')
        .eq('agency_id', userProfile.agency_id)

      if (error) throw error
      return data || []
    },
    enabled: !!apartmentId
  })
}