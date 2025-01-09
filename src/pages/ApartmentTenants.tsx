import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, CreditCard, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface ApartmentTenant {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone_number: string | null
  birth_date: string | null
  unit_id: string
  apartment_units: {
    unit_number: string
    apartment: {
      name: string
    }
  }
}

export default function ApartmentTenants() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("profiles")
        .select("agency_id, role")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants", userProfile?.agency_id],
    queryFn: async () => {
      if (!userProfile?.agency_id) return []

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments(name)
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data as ApartmentTenant[]
    },
    enabled: !!userProfile?.agency_id
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
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
                    <TableCell>{tenant.first_name}</TableCell>
                    <TableCell>{tenant.last_name}</TableCell>
                    <TableCell>{tenant.email || "-"}</TableCell>
                    <TableCell>{tenant.phone_number || "-"}</TableCell>
                    <TableCell>
                      {tenant.apartment_units?.apartment?.name || "-"}
                    </TableCell>
                    <TableCell>{tenant.apartment_units?.unit_number || "-"}</TableCell>
                    <TableCell>
                      {tenant.birth_date
                        ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                        : "-"}
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
        </div>
      </div>
    </AgencyLayout>
  )
}