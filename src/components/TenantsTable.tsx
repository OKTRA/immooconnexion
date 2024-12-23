import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { TenantsTableHeader } from "./tenants/TenantsTableHeader"
import { TenantsTableContent } from "./tenants/TenantsTableContent"
import { TenantDisplay, useTenants } from "@/hooks/use-tenants"

interface TenantsTableProps {
  onEdit: (tenant: TenantDisplay) => void
}

export function TenantsTable({ onEdit }: TenantsTableProps) {
  const { tenants, isLoading, error, session } = useTenants()

  if (!session) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des locataires
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TenantsTableHeader />
          <TenantsTableContent tenants={tenants} onEdit={onEdit} />
        </Table>
      </div>
    </div>
  )
}