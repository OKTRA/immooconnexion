import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TenantTableRow } from "./tenants/TenantTableRow"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface TenantDisplay {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  photoIdUrl?: string
  fraisAgence?: string
  user_id?: string
}

export function TenantsTable({ onEdit }: { onEdit: (tenant: TenantDisplay) => void }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  // Check authentication status
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

      // Récupérer d'abord le profil de l'utilisateur pour vérifier son rôle
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

      // Construction de la requête en fonction du rôle de l'utilisateur
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

      // Si l'utilisateur n'est pas admin, filtrer par id du profil
      if (profileData?.role !== 'admin') {
        // On cherche les locataires liés à ce profil
        query = query.eq('agency_id', profileData.id)
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

  if (!session) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des locataires
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Date de Naissance</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="text-center py-4">
                  Aucun locataire trouvé
                </td>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TenantTableRow
                  key={tenant.id}
                  tenant={tenant}
                  onEdit={onEdit}
                  onDelete={async (id) => {
                    try {
                      const { error } = await supabase
                        .from('tenants')
                        .delete()
                        .eq('id', id)

                      if (error) throw error

                      toast({
                        title: "Locataire supprimé",
                        description: "Le locataire a été supprimé avec succès.",
                      })
                    } catch (error: any) {
                      console.error('Error in handleDelete:', error)
                      toast({
                        title: "Erreur",
                        description: "Une erreur est survenue lors de la suppression.",
                        variant: "destructive",
                      })
                    }
                  }}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}