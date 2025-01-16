import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApartmentUnitsTable } from "./ApartmentUnitsTable"
import { ApartmentUnitDialog } from "./ApartmentUnitDialog"
import { ApartmentUnit } from "@/types/apartment"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface ApartmentUnitsSectionProps {
  apartmentId: string
  units: ApartmentUnit[]
  isLoading: boolean
  onCreateUnit: (unit: ApartmentUnit) => Promise<void>
  onUpdateUnit: (unit: ApartmentUnit) => Promise<void>
  onDeleteUnit: (unitId: string) => Promise<void>
  onEdit: (unit: ApartmentUnit) => void
}

export function ApartmentUnitsSection({
  apartmentId,
  units,
  isLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit,
  onEdit
}: ApartmentUnitsSectionProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<ApartmentUnit | undefined>()
  const { toast } = useToast()

  const handleEdit = (unit: ApartmentUnit) => {
    console.log("Editing unit:", unit)
    setEditingUnit(unit)
    setShowDialog(true)
    onEdit(unit)
  }

  const handleAdd = () => {
    console.log("Adding new unit for apartment:", apartmentId)
    setEditingUnit(undefined)
    setShowDialog(true)
  }

  const handleSubmit = async (unitData: ApartmentUnit) => {
    try {
      console.log("Handling unit submission:", unitData)
      if (editingUnit) {
        await onUpdateUnit(unitData)
        toast({
          title: "Succès",
          description: "L'unité a été mise à jour avec succès"
        })
      } else {
        await onCreateUnit(unitData)
        toast({
          title: "Succès",
          description: "L'unité a été créée avec succès"
        })
      }
      setShowDialog(false)
      setEditingUnit(undefined)
    } catch (error) {
      console.error("Error handling unit submission:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
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
            apartmentId={apartmentId}
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