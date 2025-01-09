import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"
import { Loader2 } from "lucide-react"

interface ApartmentTenantsTableProps {
  apartmentId: string
  isLoading: boolean
  onEdit: (tenant: ApartmentTenant) => void
  onDelete: (id: string) => Promise<void>
}

export function ApartmentTenantsTable({
  apartmentId,
  isLoading,
  onEdit,
  onDelete
}: ApartmentTenantsTableProps) {
  const { data: tenants = [] } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("apartment_id", apartmentId)

      if (error) throw error
      return data as ApartmentTenant[]
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date de naissance</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
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
                {tenant.birth_date
                  ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tenant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}