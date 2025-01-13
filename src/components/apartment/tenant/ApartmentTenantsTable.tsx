import { ApartmentTenant } from "@/types/apartment"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"

interface ApartmentTenantsTableProps {
  tenants: ApartmentTenant[];
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function ApartmentTenantsTable({ tenants, onEdit, onDelete }: ApartmentTenantsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.first_name} {tenant.last_name}</TableCell>
            <TableCell>{tenant.email}</TableCell>
            <TableCell>{tenant.phone_number}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={onEdit}>
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
      </TableBody>
    </Table>
  )
}