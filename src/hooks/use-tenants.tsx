import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface TenantDisplay {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  photoIdUrl?: string
  fraisAgence?: string
  user_id?: string
}

export function useTenants() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login')
        return
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      if (!session) {
        throw new Error("Non authentifié")
      }
      
      console.log('Début de la requête des locataires...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Utilisateur non authentifié')
        throw new Error("Non authentifié")
      }

      console.log('User ID:', user.id)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      
      if (profileError) {
        console.error('Erreur lors de la vérification du profil:', profileError)
        throw profileError
      }
      
      console.log('Profil utilisateur:', profileData)

      let query = supabase
        .from('tenants')
        .select(`
          id,
          nom,
          prenom,
          birth_date,
          phone_number,
          photo_id_url,
          agency_fees,
          user_id,
          agency_id
        `)

      // Si l'utilisateur n'est pas admin, on filtre par user_id
      if (profileData?.role !== 'admin') {
        query = query.eq('user_id', profileData.id)
        console.log('Filtrage par profile id:', profileData.id)
      }
      
      const { data: tenantsData, error: tenantsError } = await query
        .order('created_at', { ascending: false })
      
      if (tenantsError) {
        console.error('Erreur lors de la récupération des locataires:', tenantsError)
        throw tenantsError
      }
      
      console.log('Données des locataires brutes:', tenantsData)

      return tenantsData.map((tenant: any) => ({
        id: tenant.id,
        nom: tenant.nom || '',
        prenom: tenant.prenom || '',
        dateNaissance: tenant.birth_date || '',
        telephone: tenant.phone_number || '',
        photoIdUrl: tenant.photo_id_url,
        fraisAgence: tenant.agency_fees?.toString(),
        user_id: tenant.user_id,
      }))
    },
    enabled: !!session,
    meta: {
      onError: (error: any) => {
        console.error('Erreur de requête:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les locataires. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    }
  })

  return { tenants, isLoading, error, session }
}