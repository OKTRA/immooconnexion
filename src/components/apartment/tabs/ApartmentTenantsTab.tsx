import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ApartmentTenantsTable } from "../tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "../tenant/ApartmentTenantDialog"
import { ApartmentTenant, ApartmentTenantsTabProps } from "@/types/apartment"

export function ApartmentTenantsTab({
  apartmentId,
  isLoading,
  onDeleteTenant,
  onEditTenant
}: ApartmentTenantsTabProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<ApartmentTenant | null>(null)

  const handleEdit = (tenant: ApartmentTenant) => {
    setSelectedTenant(tenant)
    setShowDialog(true)
    onEditTenant(tenant)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locataires</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un locataire
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ApartmentTenantsTable
            apartmentId={apartmentId}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={onDeleteTenant}
          />
        </CardContent>
      </Card>

      <ApartmentTenantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        apartmentId={apartmentId}
        tenant={selectedTenant}
      />
    </div>
  )
}