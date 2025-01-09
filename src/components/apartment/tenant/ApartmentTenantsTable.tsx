import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TenantActionButtons } from "./TenantActionButtons"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface ApartmentTenantsTableProps {
  apartmentId: string
  onEdit: (tenant: any) => void
  onDelete: (id: string) => Promise<void>
}

export function ApartmentTenantsTable({
  apartmentId,
  onEdit,
  onDelete,
}: ApartmentTenantsTableProps) {
  const { data: tenantsList = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
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
          apartment_leases (
            id,
            rent_amount,
            deposit_amount,
            start_date,
            end_date,
            status
          ),
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data || []
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Appartement</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenantsList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Aucun locataire trouvé
            </TableCell>
          </TableRow>
        ) : (
          tenantsList.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.last_name}</TableCell>
              <TableCell>{tenant.first_name}</TableCell>
              <TableCell>{tenant.email || "-"}</TableCell>
              <TableCell>{tenant.phone_number || "-"}</TableCell>
              <TableCell>{tenant.apartment_units?.apartment?.name || "-"}</TableCell>
              <TableCell>{tenant.apartment_units?.unit_number || "-"}</TableCell>
              <TableCell>
                <TenantActionButtons
                  tenant={tenant}
                  currentLease={tenant.apartment_leases?.[0]}
                  onEdit={() => onEdit(tenant)}
                  onDelete={() => onDelete(tenant.id)}
                  onInspection={() => {}}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}