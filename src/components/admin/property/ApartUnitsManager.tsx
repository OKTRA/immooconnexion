import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PropertyUnitDialog } from "./PropertyUnitDialog"
import { PropertyUnitsTable } from "./components/PropertyUnitsTable"
import { useApartUnits } from "@/hooks/useApartUnits"
import { toast } from "@/components/ui/use-toast"

interface ApartUnitsManagerProps {
  propertyId: string;
  filterStatus?: 'available' | 'occupied';
}

export function ApartUnitsManager({ propertyId, filterStatus }: ApartUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<any>(null)
  
  const {
    units,
    isLoading,
    mutation,
    deleteMutation
  } = useApartUnits(propertyId, filterStatus)

  const handleSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync(data)
      setIsDialogOpen(false)
      setEditingUnit(null)
      toast({
        title: "Succès",
        description: "L'unité a été sauvegardée avec succès",
      })
    } catch (error) {
      console.error('Error saving unit:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (unitId: string) => {
    try {
      await deleteMutation.mutateAsync(unitId)
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      })
    } catch (error) {
      console.error('Error deleting unit:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingUnit(null)
            setIsDialogOpen(true)
          }}
          className="ml-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une unité
        </Button>
      </div>

      <PropertyUnitsTable
        units={units || []}
        onEdit={(unit) => {
          setEditingUnit(unit)
          setIsDialogOpen(true)
        }}
        onDelete={handleDelete}
      />

      <PropertyUnitDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingUnit(null)
        }}
        editingUnit={editingUnit}
        propertyId={propertyId}
        onSubmit={handleSubmit}
      />
    </div>
  )
}