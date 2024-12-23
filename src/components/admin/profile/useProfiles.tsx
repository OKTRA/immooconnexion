import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Agency {
  name: string
}

interface LocalAdmin {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  phone_number: string
  created_at: string
  agency_id: string | null
  agency: Agency | null
}

interface TransformedAdmin extends LocalAdmin {
  agency_name: string
}

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log('Début de la récupération des admins...')
      
      // Récupérer tous les administrateurs locaux avec leurs agences associées
      const { data, error } = await supabase
        .from("local_admins")
        .select(`
          *,
          agency:agencies(name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des admins:', error)
        throw error
      }

      console.log('Données brutes récupérées:', data)

      // Transformer les données pour inclure le nom de l'agence directement
      const transformedData = data.map(admin => ({
        ...admin,
        agency_name: admin.agency?.name || '-'
      })) as TransformedAdmin[]

      console.log('Admins transformés:', transformedData)
      return transformedData
    },
  })
}