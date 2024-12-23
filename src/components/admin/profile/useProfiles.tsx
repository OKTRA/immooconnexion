import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Agency {
  name: string
}

interface RawProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: string | null
  phone_number: string | null
  show_phone_on_site: boolean | null
  list_properties_on_site: boolean | null
  created_at: string
  agency: Agency[] | null
}

interface TransformedProfile extends Omit<RawProfile, 'agency'> {
  agency_name: string
}

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log('Fetching profiles...')
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          agency:agencies (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
        throw error
      }

      // Transform the data to include agency_name
      const transformedData = (data as RawProfile[])?.map(profile => ({
        ...profile,
        agency_name: profile.agency?.[0]?.name || '-'
      })) as TransformedProfile[]

      console.log('Fetched profiles:', transformedData)
      return transformedData
    },
  })
}