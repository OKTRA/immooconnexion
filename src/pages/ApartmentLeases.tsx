import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentLeasesTable } from "@/components/apartment/lease/ApartmentLeasesTable"
import { Button } from "@/components/ui/button"
import { Plus, FilePlus } from "lucide-react"
import { useState } from "react"
import { CreateLeaseDialog } from "@/components/apartment/lease/CreateLeaseDialog"
import { SimpleLeaseDialog } from "@/components/apartment/lease/SimpleLeaseDialog"

export default function ApartmentLeases() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSimpleDialog, setShowSimpleDialog] = useState(false)

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Baux</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowSimpleDialog(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Bail Simple
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <FilePlus className="w-4 h-4 mr-2" />
              Bail Complet
            </Button>
          </div>
        </div>

        <ApartmentLeasesTable />

        <CreateLeaseDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        <SimpleLeaseDialog
          open={showSimpleDialog}
          onOpenChange={setShowSimpleDialog}
        />
      </div>
    </AgencyLayout>
  )
}