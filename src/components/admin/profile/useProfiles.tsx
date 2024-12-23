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
      
      const { data, error } = await supabase
        .from("local_admins")
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          phone_number,
          created_at,
          agency_id,
          agency:agencies(name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des admins:', error)
        console.error('Détails de l\'erreur:', error.message, error.details, error.hint)
        throw error
      }

      console.log('Données brutes récupérées:', data)

      const transformedData = data?.map(admin => ({
        ...admin,
        agency_name: admin.agency?.name || '-'
      })) as TransformedAdmin[]

      console.log('Admins transformés:', transformedData)
      return transformedData
    },
  })
}