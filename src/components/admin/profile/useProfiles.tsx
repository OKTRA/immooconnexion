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
          agency:agencies(
            name,
            address,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
        throw error
      }

      console.log('Fetched profiles:', data)
      return data
    },
  })
}