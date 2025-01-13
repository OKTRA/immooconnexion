import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"

interface TenantTableRowProps {
  tenant: {
    id: string;
    nom: string;
    prenom: string;
    phone_number?: string;
    profession?: string;
  };
  onEdit: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TenantTableRow({ tenant, onEdit, onDelete }: TenantTableRowProps) {
  return (
    <TableRow>
      <TableCell>{tenant.nom}</TableCell>
      <TableCell>{tenant.prenom}</TableCell>
      <TableCell>{tenant.phone_number || '-'}</TableCell>
      <TableCell>{tenant.profession || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(tenant.id)}
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
  )
}