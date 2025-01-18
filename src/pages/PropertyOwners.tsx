import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyOwnersTable } from "@/components/property-owners/PropertyOwnersTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { PropertyOwnerDialog } from "@/components/property-owners/PropertyOwnerDialog"

export default function PropertyOwners() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Propriétaires</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un propriétaire
          </Button>
        </div>

        <PropertyOwnersTable />
        <PropertyOwnerDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
        />
      </div>
    </AgencyLayout>
  )
}