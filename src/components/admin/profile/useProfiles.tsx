import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // First, fetch profiles in a single query
        const { data: profilesWithAgencies, error } = await supabase
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
            agency_id,
            agencies (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching profiles:', error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les profils",
            variant: "destructive",
          })
          throw error
        }

        // Transform the data to match the expected format
        const transformedData = profilesWithAgencies?.map(profile => ({
          ...profile,
          agency_name: profile.agencies?.name || '-'
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