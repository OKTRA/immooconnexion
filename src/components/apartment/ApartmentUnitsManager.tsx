import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ApartmentUnitDialog } from "./ApartmentUnitDialog"
import { ApartmentUnitsTable } from "./ApartmentUnitsTable"
import { useApartmentUnits } from "./hooks/useApartmentUnits"

interface ApartmentUnitsManagerProps {
  apartmentId: string;
}

export function ApartmentUnitsManager({ apartmentId }: ApartmentUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<any>(null)
  const { units, isLoading, mutation, deleteMutation } = useApartmentUnits(apartmentId)

  const handleEdit = (unit: any) => {
    setEditingUnit(unit)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync(data)
      setIsDialogOpen(false)
      setEditingUnit(null)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (unitId: string) => {
    try {
      await deleteMutation.mutateAsync(unitId)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Chargement des unités...</div>
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          Liste des unités
        </CardTitle>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une unité
        </Button>
      </CardHeader>
      <CardContent>
        <ApartmentUnitsTable
          units={units}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ApartmentUnitDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingUnit(null)
          }}
          editingUnit={editingUnit}
          apartmentId={apartmentId}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  )
}