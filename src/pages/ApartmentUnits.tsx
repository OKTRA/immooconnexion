import { useParams, Navigate } from "react-router-dom"
import { useState } from "react"
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { ApartmentUnit } from "@/types/apartment"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useApartmentUnits } from "@/hooks/use-apartment-units"

export default function ApartmentUnits() {
  const { id } = useParams<{ id: string }>()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | undefined>()

  // Validate ID format (basic UUID validation)
  const isValidUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  if (!isValidUUID) {
    return <Navigate to="/agence/appartements" replace />
  }

  const {
    data: units = [],
    isLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(id)

  const handleSubmit = async (data: ApartmentUnit) => {
    if (selectedUnit) {
      await updateUnit.mutateAsync(data)
    } else {
      await createUnit.mutateAsync(data)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des unités</h1>
        <Button onClick={() => {
          setSelectedUnit(undefined)
          setShowAddDialog(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une unité
        </Button>
      </div>

      <ApartmentUnitsTable
        units={units}
        isLoading={isLoading}
        onEdit={(unit) => {
          setSelectedUnit(unit)
          setShowAddDialog(true)
        }}
        onDelete={(unitId) => deleteUnit.mutate(unitId)}
      />

      <ApartmentUnitDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleSubmit}
        initialData={selectedUnit}
        apartmentId={id}
        isEditing={!!selectedUnit}
      />
    </div>
  )
}