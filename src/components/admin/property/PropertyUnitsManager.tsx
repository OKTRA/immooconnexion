import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PropertyUnitDialog } from "./PropertyUnitDialog"
import { PropertyUnitsTable } from "./PropertyUnitsTable"
import { usePropertyUnits } from "@/hooks/use-property-units"
import { PropertyUnit, PropertyUnitFormData } from "@/types/property"

interface PropertyUnitsManagerProps {
  propertyId: string
}

export function PropertyUnitsManager({ propertyId }: PropertyUnitsManagerProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnitFormData | undefined>()
  const { data: units, isLoading } = usePropertyUnits(propertyId)

  const handleEdit = (unit: PropertyUnit) => {
    const formData: PropertyUnitFormData = {
      property_id: unit.property_id,
      unit_number: unit.unit_number,
      floor_number: unit.floor_number,
      area: unit.area,
      rent_amount: unit.rent_amount,
      deposit_amount: unit.deposit_amount,
      status: unit.status,
      description: unit.description
    }
    setEditingUnit(formData)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setEditingUnit(undefined)
    setShowDialog(true)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unités</h3>
        <Button onClick={handleAdd}>Ajouter une unité</Button>
      </div>

      <PropertyUnitsTable
        units={units}
        onEdit={handleEdit}
      />

      <PropertyUnitDialog
        propertyId={propertyId}
        open={showDialog}
        onOpenChange={setShowDialog}
        initialData={editingUnit}
      />
    </div>
  )
}