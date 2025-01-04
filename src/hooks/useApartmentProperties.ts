import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useApartmentProperties() {
  return useQuery({
    queryKey: ['apartment-properties'],
    queryFn: async () => {
      console.log("Fetching apartment properties...")
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated")
        throw new Error("Non authentifié")
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        console.error("No agency associated with user")
        throw new Error("Aucune agence associée")
      }

      console.log("User profile:", profile)

      let query = supabase
        .from('properties')
        .select('*')
        .eq('agency_id', profile.agency_id)
        .eq('property_category', 'apartment')
        .order('created_at', { ascending: false })

      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching properties:", error)
        throw error
      }

      console.log("Fetched properties:", data)
      return data
    }
  })
}