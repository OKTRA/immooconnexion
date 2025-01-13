import { TableCell, TableRow } from "@/components/ui/table"
import { TenantDisplay } from "@/hooks/use-tenants"
import { TenantActionButtons } from "./TenantActionButtons"

interface TenantsTableContentProps {
  tenants: TenantDisplay[];
  onEdit: (tenant: TenantDisplay) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TenantsTableContent({
  tenants,
  onEdit,
  onDelete,
}: TenantsTableContentProps) {
  return (
    <tbody>
      {tenants.map((tenant) => (
        <TableRow key={tenant.id}>
          <TableCell>{tenant.first_name}</TableCell>
          <TableCell>{tenant.last_name}</TableCell>
          <TableCell>{tenant.phone_number}</TableCell>
          <TableCell>{tenant.profession || "-"}</TableCell>
          <TableCell>
            <TenantActionButtons
              tenant={tenant}
              onEdit={() => onEdit(tenant)}
              onDelete={() => onDelete(tenant.id)}
              onInspection={() => {}}
            />
          </TableCell>
        </TableRow>
      ))}
    </tbody>
  );
}