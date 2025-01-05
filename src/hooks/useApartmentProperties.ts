import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useApartmentProperties() {
  return useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      console.log('Fetching apartment properties...')
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error('Non authentifié')
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', profile.user.id)
        .single()

      console.log('User profile:', userProfile)

      if (!userProfile?.agency_id) {
        throw new Error('Aucune agence associée')
      }

      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('agency_id', userProfile.agency_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log('Fetched apartments:', data)
      return data
    }
  })
}