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
      
      // Get current user's profile to check role and agency
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Aucun utilisateur connecté')
        throw new Error("Non authentifié")
      }
      console.log('User ID:', user.id)

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      console.log('Profil utilisateur:', userProfile)

      // Build the query based on user role
      let query = supabase
        .from("local_admins")
        .select(`
          *,
          agency:agencies(name)
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show agency's admins
      if (userProfile?.role !== 'admin') {
        if (userProfile?.agency_id) {
          query = query.eq('agency_id', userProfile.agency_id)
          console.log('Filtrage par agency_id:', userProfile.agency_id)
        } else {
          query = query.is('agency_id', null)
          console.log('Filtrage pour les admins sans agence')
        }
      }

      const { data, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des admins:', error)
        throw error
      }

      console.log('Données brutes récupérées:', data)

      // Transformer les données pour inclure le nom de l'agence directement
      const transformedData = (data || []).map(admin => ({
        ...admin,
        agency_name: admin.agency?.name || '-'
      })) as TransformedAdmin[]

      console.log('Admins transformés:', transformedData)
      return transformedData
    },
  })
}