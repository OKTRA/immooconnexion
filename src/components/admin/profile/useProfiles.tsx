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
  agency_id: string | null
  agency: Agency | null
}

interface TransformedProfile extends RawProfile {
  agency_name: string
}

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // Récupérer les profils avec les informations d'agence
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
            agency:agencies!profiles_agency_id_fkey (
              name
            )
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
        })) as TransformedProfile[]

        return transformedData
      } catch (error) {
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