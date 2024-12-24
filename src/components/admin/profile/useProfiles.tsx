import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // First, fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            email,
            role,
            phone_number,
            show_phone_on_site,
            list_properties_on_site,
            created_at,
            agency_id
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          toast({
            title: "Erreur",
            description: "Impossible de charger les profils",
            variant: "destructive",
          })
          throw profilesError
        }

        // Then, fetch agencies separately
        const { data: agencies, error: agenciesError } = await supabase
          .from("agencies")
          .select('id, name')

        if (agenciesError) {
          console.error('Error fetching agencies:', agenciesError)
          throw agenciesError
        }

        // Map agencies to profiles
        const transformedData = profiles?.map(profile => ({
          ...profile,
          agency_name: agencies?.find(agency => agency.id === profile.agency_id)?.name || '-'
        }))

        return transformedData || []
      } catch (error: any) {
        console.error('Error in useProfiles:', error)
        throw error
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error)
      }
    }
  })
}