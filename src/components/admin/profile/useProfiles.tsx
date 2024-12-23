import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log('Fetching profiles...')
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          agency:agencies!profiles_agency_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
        throw error
      }

      // Transform the data to include agency_name
      const transformedData = data?.map(profile => ({
        ...profile,
        agency_name: profile.agency?.name || '-'
      }))

      console.log('Fetched profiles:', transformedData)
      return transformedData
    },
  })
}