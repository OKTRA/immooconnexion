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
        navigate('/agence/login')
        return
      }
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/agence/login')
        return
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const { data: tenants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      if (!session) {
        throw new Error("Non authentifié")
      }
      
      // Get the user's profile to access their agency_id
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Non authentifié")
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()
      
      if (profileError) {
        console.error('Erreur lors de la vérification du profil:', profileError)
        throw profileError
      }

      if (!profileData?.agency_id) {
        console.log('No agency_id found for user')
        return []
      }

      console.log('Fetching tenants for agency:', profileData.agency_id)

      const { data: tenantsData, error: tenantsError } = await supabase
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
        .eq('agency_id', profileData.agency_id)
        .order('created_at', { ascending: false })
      
      if (tenantsError) {
        console.error('Erreur lors de la récupération des locataires:', tenantsError)
        throw tenantsError
      }

      console.log('Tenants data:', tenantsData)

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
    enabled: !!session
  })

  return { tenants, isLoading, error, session, refetch }
}