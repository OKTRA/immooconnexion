import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TenantActionButtons } from "@/components/apartment/tenant/TenantActionButtons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"

export default function ApartmentTenants() {
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: userProfile } = await supabase.auth.getUser()
      if (!userProfile.user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", userProfile.user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            rent_amount,
            deposit_amount,
            start_date,
            end_date,
            status
          )
        `)
        .eq("agency_id", profile.agency_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    }
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
        <h1 className="text-2xl font-bold mb-6">Locataires des appartements</h1>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.last_name}</TableCell>
                  <TableCell>{tenant.first_name}</TableCell>
                  <TableCell>{tenant.email || "-"}</TableCell>
                  <TableCell>{tenant.phone_number || "-"}</TableCell>
                  <TableCell>
                    {tenant.birth_date
                      ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <TenantActionButtons
                      tenant={tenant}
                      currentLease={tenant.apartment_leases?.[0]}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onInspection={() => {}}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucun locataire trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AgencyLayout>
  )
}