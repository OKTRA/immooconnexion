import { TableBody } from "@/components/ui/table"
import { TenantTableRow } from "./TenantTableRow"
import { TenantDisplay } from "@/hooks/use-tenants"

interface TenantsTableContentProps {
  tenants: TenantDisplay[]
  onEdit: (tenant: TenantDisplay) => void
  onDelete: (id: string) => void
}

export function TenantsTableContent({ tenants, onEdit, onDelete }: TenantsTableContentProps) {
  if (tenants.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={5} className="text-center py-4">
            Aucun locataire trouvé
          </td>
        </tr>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {tenants.map((tenant) => (
        <TenantTableRow
          key={tenant.id}
          tenant={tenant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  )
}