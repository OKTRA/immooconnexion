import { Button } from "@/components/ui/button"
import { Trash, Pencil, FileText } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { CreateLeaseDialog } from "../lease/CreateLeaseDialog"

interface ApartmentTenantsTableProps {
  onEdit?: (tenant: any) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function ApartmentTenantsTable({
  onEdit,
  onDelete,
  isLoading
}: ApartmentTenantsTableProps) {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)

  const { data: tenants = [] } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      console.log("Fetching tenants...")
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          tenant_units (
            unit_id,
            apartment_units (
              unit_number,
              apartment:apartments (
                name
              )
            )
          ),
          apartment_leases (
            id,
            tenant_id,
            unit_id,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            status,
            payment_frequency,
            duration_type,
            payment_type
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching tenants:", error)
        throw error
      }

      console.log("Fetched tenants:", data)
      return data
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">Nom</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Téléphone</th>
            <th className="p-4 text-left">Unité</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b">
              <td className="p-4">
                {tenant.first_name} {tenant.last_name}
              </td>
              <td className="p-4">{tenant.email || "-"}</td>
              <td className="p-4">{tenant.phone_number || "-"}</td>
              <td className="p-4">
                {tenant.tenant_units?.[0]?.apartment_units?.apartment?.name} 
                {tenant.tenant_units?.[0]?.apartment_units?.unit_number 
                  ? ` - Unité ${tenant.tenant_units[0].apartment_units.unit_number}`
                  : "-"}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(tenant)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(tenant.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedTenantId(tenant.id)
                      setShowLeaseDialog(true)
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTenantId && (
        <CreateLeaseDialog
          open={showLeaseDialog}
          onOpenChange={setShowLeaseDialog}
          tenantId={selectedTenantId}
        />
      )}
    </div>
  )
}