import { Button } from "@/components/ui/button"
import { TenantFormData } from "@/types/tenant"

interface TenantActionsProps {
  tenant: TenantFormData
  onEdit: (tenant: TenantFormData) => void
  onDelete: (id: string) => Promise<void>
}

export function TenantActions({ tenant, onEdit, onDelete }: TenantActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => onEdit(tenant)}>
        Modifier
      </Button>
      <Button variant="destructive" onClick={() => onDelete(tenant.id)}>
        Supprimer
      </Button>
    </div>
  )
}
