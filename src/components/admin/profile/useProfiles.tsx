import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Agency {
  name: string
}

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: string | null
  phone_number: string | null
  created_at: string
  agency_id: string | null
  agency: Agency | null
}

interface TransformedProfile extends Profile {
  agency_name: string
}

export function useProfiles() {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      console.log('Début de la récupération des profils...')
      
      // Get current user's profile to check role and agency
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Aucun utilisateur connecté')
        throw new Error("Non authentifié")
      }
      console.log('User ID:', user.id)

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Erreur lors de la récupération du profil:', profileError)
        throw profileError
      }

      console.log('Profil utilisateur:', userProfile)

      // Build the query based on user role
      let query = supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          phone_number,
          created_at,
          agency_id,
          agency:agencies!profiles_agency_id_fkey(name)
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show agency's profiles
      if (userProfile?.role !== 'admin') {
        if (userProfile?.agency_id) {
          query = query.eq('agency_id', userProfile.agency_id)
          console.log('Filtrage par agency_id:', userProfile.agency_id)
        } else {
          console.log('Filtrage pour les profils sans agence')
          return []
        }
      }

      const { data, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des profils:', error)
        throw error
      }

      console.log('Données brutes récupérées:', data)

      // Transform data to include agency name directly
      const transformedData = (data || []).map(profile => ({
        ...profile,
        agency_name: profile.agency?.name || '-'
      })) as TransformedProfile[]

      console.log('Profils transformés:', transformedData)
      return transformedData
    },
    retry: 1,
    meta: {
      errorMessage: "Impossible de charger les profils. Veuillez réessayer."
    }
  })
}