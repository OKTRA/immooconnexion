import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ApartmentTenantsTableProps {
  tenants: any[]
  onEdit: (tenant: any) => void
  onDelete: (id: string) => void
}

export function ApartmentTenantsTable({
  tenants,
  onEdit,
  onDelete,
}: ApartmentTenantsTableProps) {
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
                  onClick={() => onDelete(tenant.id)}
                >
                  <Trash className="h-4 w-4" />
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