import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Receipt, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"
import { useNavigate } from "react-router-dom"

interface ApartmentTenantsTableProps {
  apartmentId: string
  onEdit: (tenant: ApartmentTenant) => void
  onDelete: (id: string) => Promise<void>
}

export function ApartmentTenantsTable({
  apartmentId,
  onEdit,
  onDelete,
}: ApartmentTenantsTableProps) {
  const navigate = useNavigate()
  const { data: tenants = [] } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("apartment_id", apartmentId)

      if (error) throw error
      return data as ApartmentTenant[]
    },
  })

  return (
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
              <div className="flex items-center gap-2">
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
                  onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/recu`)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/paiements`)}
                >
                  <CreditCard className="h-4 w-4" />
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
  )
}