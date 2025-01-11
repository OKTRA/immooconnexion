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
            nom: tenant.first_name,
            prenom: tenant.last_name,
            dateNaissance: tenant.birth_date || '',
            telephone: tenant.phone_number,
            photoIdUrl: tenant.photo_id_url,
            fraisAgence: tenant.agency_fees?.toString(),
            profession: tenant.profession
          }}
          onEdit={() => onEdit(tenant)}
          onDelete={async (id) => await onDelete(id)}
        />
      ))}
    </TableBody>
  )
}