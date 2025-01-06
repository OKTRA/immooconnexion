import { useParams } from "react-router-dom"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { ApartmentUnit } from "@/types/apartment"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApartmentUnits() {
  const { id = "" } = useParams()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | undefined>()
  const { toast } = useToast()

  const { data: units = [], isLoading, refetch } = useQuery({
    queryKey: ["apartment-units", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", id)
        .order("unit_number")

      if (error) throw error
      return data as ApartmentUnit[]
    }
  })

  const handleAddUnit = async (unitData: ApartmentUnit) => {
    try {
      const { error } = await supabase
        .from("apartment_units")
        .insert(unitData)

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'unité a été ajoutée avec succès",
      })

      refetch()
    } catch (error) {
      console.error("Error adding unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'unité",
        variant: "destructive",
      })
    }
  }

  const handleEditUnit = async (unitData: ApartmentUnit) => {
    try {
      const { error } = await supabase
        .from("apartment_units")
        .update(unitData)
        .eq("id", unitData.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'unité a été modifiée avec succès",
      })

      refetch()
    } catch (error) {
      console.error("Error updating unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'unité",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUnit = async (unitId: string) => {
    try {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      })

      refetch()
    } catch (error) {
      console.error("Error deleting unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'unité",
        variant: "destructive",
      })
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
        onDelete={handleDeleteUnit}
      />

      <ApartmentUnitDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={selectedUnit ? handleEditUnit : handleAddUnit}
        initialData={selectedUnit}
        apartmentId={id}
        isEditing={!!selectedUnit}
      />
    </div>
  )
}