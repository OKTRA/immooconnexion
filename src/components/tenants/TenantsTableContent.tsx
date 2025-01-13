import { TableBody } from "@/components/ui/table"
import { TenantTableRow } from "./TenantTableRow"
import { TenantDisplay } from "@/types/tenant"

interface TenantsTableContentProps {
  tenants: TenantDisplay[];
  onEdit: (tenant: TenantDisplay) => void;
  onDelete: (id: string) => void;
}

export function TenantsTableContent({
  tenants,
  onEdit,
  onDelete
}: TenantsTableContentProps) {
  return (
    <TableBody>
      {tenants.map((tenant) => (
        <TenantTableRow
          key={tenant.id}
          tenant={{
            id: tenant.id,
            nom: tenant.last_name,
            prenom: tenant.first_name,
            phone_number: tenant.phone_number,
            profession: tenant.profession
          }}
          onEdit={() => onEdit(tenant)}
          onDelete={() => onDelete(tenant.id)}
        />
      ))}
    </TableBody>
  )
}