import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentLeasesTable } from "@/components/apartment/lease/ApartmentLeasesTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateLeaseDialog } from "@/components/apartment/lease/CreateLeaseDialog"

export default function ApartmentLeases() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Baux</h1>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Bail
          </Button>
        </div>

        <ApartmentLeasesTable />

        <CreateLeaseDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </AgencyLayout>
  )
}