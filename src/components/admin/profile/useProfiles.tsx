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
      console.log('Début de la récupération des profils...')
      
      // Récupérer d'abord tous les profils pour debug
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from("profiles")
        .select("*")
      
      console.log('Tous les profils dans la base:', allProfiles)
      
      if (allProfilesError) {
        console.error("Erreur lors de la récupération de tous les profils:", allProfilesError)
      }

      // Maintenant, récupérer les profils avec les informations d'agence
      // En utilisant la relation profiles_agency_id_fkey
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
        console.error('Détails de l\'erreur:', error.message, error.details, error.hint)
        throw error
      }

      console.log('Données brutes récupérées:', data)

      // Transformer les données pour inclure le nom de l'agence
      const transformedData = data?.map(profile => ({
        ...profile,
        agency_name: profile.agency?.name || '-'
      })) as TransformedProfile[]

      console.log('Profils transformés:', transformedData)
      return transformedData
    },
  })
}