import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PropertyDialog } from "@/components/PropertyDialog"
import { PropertyTable } from "@/components/PropertyTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function Properties() {
  const [open, setOpen] = useState(false)

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Propriétés</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une propriété
          </Button>
        </div>

        <PropertyTable />

        <PropertyDialog 
          open={open} 
          onOpenChange={setOpen}
        />
      </div>
    </AgencyLayout>
  )
}