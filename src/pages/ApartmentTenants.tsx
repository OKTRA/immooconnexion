import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, CreditCard, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

export default function ApartmentTenants() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!inner (
            unit_number,
            apartment:apartments(
              name
            )
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data
    }
  })

  const handleDelete = async (tenantId: string) => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", tenantId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Locataires des appartements</h1>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Appartement</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Aucun locataire trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>{tenant.last_name}</TableCell>
                      <TableCell>{tenant.first_name}</TableCell>
                      <TableCell>{tenant.email || "-"}</TableCell>
                      <TableCell>{tenant.phone_number || "-"}</TableCell>
                      <TableCell>{tenant.apartment_units?.apartment?.name || "-"}</TableCell>
                      <TableCell>{tenant.apartment_units?.unit_number || "-"}</TableCell>
                      <TableCell>
                        {tenant.created_at ? (
                          format(new Date(tenant.created_at), "PP", { locale: fr })
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/agence/unite/${tenant.unit_id}/tenant/${tenant.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/agence/unite/${tenant.unit_id}/tenant/${tenant.id}/payments`)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/agence/unite/${tenant.unit_id}/tenant/${tenant.id}/documents`)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  )
}