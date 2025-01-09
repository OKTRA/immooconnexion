import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ApartmentTenantsTable } from "../tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "../tenant/ApartmentTenantDialog"
import { Card, CardContent } from "@/components/ui/card"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantsTabProps {
  apartmentId: string
  onDeleteTenant: (id: string) => Promise<void>
  onEditTenant: (tenant: ApartmentTenant) => void
}

export function ApartmentTenantsTab({
  apartmentId,
  onDeleteTenant,
  onEditTenant
}: ApartmentTenantsTabProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<ApartmentTenant | null>(null)

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
            onEdit={(tenant) => {
              setSelectedTenant(tenant)
              setShowDialog(true)
              onEditTenant(tenant)
            }}
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