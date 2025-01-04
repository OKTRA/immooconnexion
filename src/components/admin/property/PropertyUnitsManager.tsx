import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Building } from "lucide-react"
import { PropertyUnitDialog } from "./components/PropertyUnitDialog"
import { PropertyUnit, PropertyUnitsManagerProps } from "./types/propertyUnit"
import { usePropertyUnits } from "./hooks/usePropertyUnits"
import { PropertyUnitsTable } from "./components/PropertyUnitsTable"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function PropertyUnitsManager({ propertyId, filterStatus }: PropertyUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null)
  const { units, isLoading, mutation, deleteMutation } = usePropertyUnits(propertyId, filterStatus)
  const { toast } = useToast()

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: PropertyUnit) => {
    try {
      await mutation.mutateAsync(data)
      toast({
        title: data.id ? "Unité modifiée" : "Unité ajoutée",
        description: "L'opération a été effectuée avec succès",
      })
      setIsDialogOpen(false)
      setEditingUnit(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (unitId: string) => {
    try {
      await deleteMutation.mutateAsync(unitId)
      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Chargement des unités...</div>
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building className="h-5 w-5" />
          Gestion des unités
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
        <PropertyUnitsTable
          units={units}
          onEdit={handleEdit}
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
      </CardContent>
    </Card>
  )
}