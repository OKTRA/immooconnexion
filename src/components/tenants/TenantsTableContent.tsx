import { TableBody } from "@/components/ui/table"
import { TenantTableRow } from "./TenantTableRow"
import { TenantDisplay } from "@/types/tenant"

interface TenantsTableContentProps {
  tenants: TenantDisplay[]
  onEdit: (tenant: TenantDisplay) => void
  onDelete: (id: string) => Promise<void>
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
          tenant={{
            id: tenant.id,
            first_name: tenant.first_name,
            last_name: tenant.last_name,
            birth_date: tenant.birth_date || '',
            phone_number: tenant.phone_number,
            photo_id_url: tenant.photo_id_url,
            agency_fees: tenant.agency_fees,
            profession: tenant.profession,
            property_id: tenant.property_id
          }}
          onEdit={() => onEdit(tenant)}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  )
}