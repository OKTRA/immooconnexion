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
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { ApartmentTenant } from "@/types/apartment"

interface TenantTableProps {
  tenants: ApartmentTenant[];
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function TenantTable({ tenants, onDelete, onEdit }: TenantTableProps) {
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
        {tenants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
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
              <TableCell>
                {tenant.birth_date
                  ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tenant.id)}
                    className="text-red-500 hover:text-red-600"
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