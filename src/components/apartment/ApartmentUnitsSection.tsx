import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApartmentUnitsTable } from "./ApartmentUnitsTable"
import { ApartmentUnitDialog } from "./ApartmentUnitDialog"
import { ApartmentUnit } from "@/types/apartment"
import { useState } from "react"

interface ApartmentUnitsSectionProps {
  apartmentId: string
  units: ApartmentUnit[]
  isLoading: boolean
  onCreateUnit: (unit: ApartmentUnit) => Promise<void>
  onUpdateUnit: (unit: ApartmentUnit) => Promise<void>
  onDeleteUnit: (unitId: string) => Promise<void>
}

export function ApartmentUnitsSection({
  apartmentId,
  units,
  isLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit
}: ApartmentUnitsSectionProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<ApartmentUnit | undefined>()

  const handleEdit = (unit: ApartmentUnit) => {
    setEditingUnit(unit)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setEditingUnit(undefined)
    setShowDialog(true)
  }

  const handleSubmit = async (unitData: ApartmentUnit) => {
    if (editingUnit) {
      await onUpdateUnit(unitData)
    } else {
      await onCreateUnit(unitData)
    }
    setShowDialog(false)
    setEditingUnit(undefined)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Unités</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle unité
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <ApartmentUnitsTable
            units={units}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={onDeleteUnit}
          />
        </CardContent>
      </Card>

      <ApartmentUnitDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialData={editingUnit}
        apartmentId={apartmentId}
        onSubmit={handleSubmit}
        isEditing={!!editingUnit}
      />
    </div>
  )
}