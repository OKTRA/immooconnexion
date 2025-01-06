import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"

export default function ApartmentUnits() {
  const { id: apartmentId } = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null)

  const { data: apartment } = useQuery({
    queryKey: ["apartment", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("id", apartmentId)
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: units = [] } = useQuery({
    queryKey: ["apartment-units", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", apartmentId)
        .order("unit_number")

      if (error) throw error
      return data
    },
  })

  const handleEdit = (unit: any) => {
    setSelectedUnit(unit)
    setDialogOpen(true)
  }

  const handleDelete = (unitId: string) => {
    setUnitToDelete(unitId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!unitToDelete) return

    try {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitToDelete)

      if (error) throw error

      toast({ title: "Unité supprimée avec succès" })
      queryClient.invalidateQueries({ queryKey: ["apartment-units"] })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setUnitToDelete(null)
    }
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["apartment-units"] })
    setSelectedUnit(null)
  }

  return (
    <AgencyLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {apartment?.name} - Unités
          </h1>
          <p className="text-muted-foreground">
            Gérez les unités de votre immeuble
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Unité
        </Button>
      </div>

      <ApartmentUnitsTable
        units={units}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ApartmentUnitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        apartmentId={apartmentId!}
        unitToEdit={selectedUnit}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'unité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AgencyLayout>
  )
}