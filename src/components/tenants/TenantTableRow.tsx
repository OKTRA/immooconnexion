import { TableCell, TableRow } from "@/components/ui/table";
import { TenantActions } from "./TenantActions";

interface TenantTableRowProps {
  tenant: {
    id: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    telephone: string;
    fraisAgence?: string;
  };
  onEdit: (tenant: any) => void;
  onDelete: (id: string) => void;
}

export function TenantTableRow({ tenant, onEdit, onDelete }: TenantTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{tenant.nom || 'Non renseigné'}</TableCell>
      <TableCell>{tenant.prenom || 'Non renseigné'}</TableCell>
      <TableCell>{tenant.dateNaissance || 'Non renseigné'}</TableCell>
      <TableCell>{tenant.telephone || 'Non renseigné'}</TableCell>
      <TableCell>
        <TenantActions
          tenant={tenant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}