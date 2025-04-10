import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { TenantDisplay } from "@/types/tenant"

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
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Non authentifié")
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()
      
      if (profileError) {
        console.error('Erreur lors de la vérification du profil:', profileError)
        throw profileError
      }

      if (!profileData?.agency_id) {
        return []
      }

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
          profession,
          created_at,
          updated_at
        `)
        .eq('agency_id', profileData.agency_id)
        .order('created_at', { ascending: false })
      
      if (tenantsError) {
        console.error('Erreur lors de la récupération des locataires:', tenantsError)
        throw tenantsError
      }

      return tenantsData.map(tenant => ({
        id: tenant.id,
        first_name: tenant.prenom,
        last_name: tenant.nom,
        birth_date: tenant.birth_date || '',
        phone_number: tenant.phone_number || '',
        photo_id_url: tenant.photo_id_url,
        agency_fees: tenant.agency_fees,
        profession: tenant.profession || '',
        created_at: tenant.created_at,
        updated_at: tenant.updated_at
      })) as TenantDisplay[]
    },
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    gcTime: 30 * 60 * 1000 // Garde en cache pendant 30 minutes
  })

  return { tenants, isLoading, error, session, refetch }
}

export type { TenantDisplay }