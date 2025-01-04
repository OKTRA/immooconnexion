import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PropertyUnitDialog } from "./components/PropertyUnitDialog"
import { PropertyUnit, PropertyUnitsManagerProps } from "./types/propertyUnit"
import { usePropertyUnits } from "./hooks/usePropertyUnits"
import { PropertyUnitsTable } from "./components/PropertyUnitsTable"

export function PropertyUnitsManager({ propertyId, filterStatus }: PropertyUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null)
  const { units, isLoading, mutation, deleteMutation } = usePropertyUnits(propertyId, filterStatus)

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unités de la propriété</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une unité
        </Button>
      </div>

      <PropertyUnitsTable
        units={units}
        onEdit={handleEdit}
        onDelete={(unitId) => deleteMutation.mutate(unitId)}
      />

      <PropertyUnitDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingUnit(null)
        }}
        editingUnit={editingUnit}
        propertyId={propertyId}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  )
}