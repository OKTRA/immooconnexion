import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log("Début de la récupération des profils...")
      
      try {
        const { data, error } = await supabase
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
            agency:agencies(name)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erreur lors de la récupération des profils:', error)
          throw error
        }

        // Transformer les données pour inclure le nom de l'agence
        const transformedData = data?.map(profile => ({
          ...profile,
          agency_name: profile.agency?.name || '-'
        }))

        console.log("Profils récupérés avec succès:", transformedData)
        return transformedData
      } catch (error: any) {
        console.error('Erreur dans useProfiles:', error)
        throw error
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Erreur de requête:', error)
      }
    }
  })
}