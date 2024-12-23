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

interface TenantDisplay {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  photoIdUrl?: string
  fraisAgence?: string
}

export function TenantsTable({ onEdit }: { onEdit: (tenant: TenantDisplay) => void }) {
  const { toast } = useToast()

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
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
          agency_id
        `)

      // Si l'utilisateur n'est pas admin, filtrer par agency_id
      if (profileData?.role !== 'admin') {
        query = query.eq('agency_id', user.id)
        console.log('Filtrage par agency_id:', user.id)
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
      }))
    },
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