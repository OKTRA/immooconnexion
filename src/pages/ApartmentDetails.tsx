import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Apartment, ApartmentUnit } from "@/types/apartment"
import { useState } from "react"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { useToast } from "@/hooks/use-toast"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showDialog, setShowDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<ApartmentUnit | undefined>()

  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ["apartment-units", id],
    queryFn: async () => {
      if (!id) throw new Error("No apartment ID provided")
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", id)
        .order("unit_number")

      if (error) throw error
      return data as ApartmentUnit[]
    },
    enabled: !!id
  })

  const { data: apartment, isLoading: apartmentLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      if (!id) throw new Error("No apartment ID provided")
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      return data as Apartment
    },
    enabled: !!id
  })

  const createUnit = useMutation({
    mutationFn: async (unitData: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .insert([unitData])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", id] })
      toast({
        title: "Succès",
        description: "L'unité a été créée avec succès"
      })
      setShowDialog(false)
    },
    onError: (error) => {
      console.error("Error creating unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'unité",
        variant: "destructive"
      })
    }
  })

  const updateUnit = useMutation({
    mutationFn: async (unitData: ApartmentUnit) => {
      const { error } = await supabase
        .from("apartment_units")
        .update({
          unit_number: unitData.unit_number,
          floor_number: unitData.floor_number,
          area: unitData.area,
          rent_amount: unitData.rent_amount,
          deposit_amount: unitData.deposit_amount,
          status: unitData.status,
          description: unitData.description
        })
        .eq("id", unitData.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", id] })
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès"
      })
      setShowDialog(false)
      setEditingUnit(undefined)
    },
    onError: (error) => {
      console.error("Error updating unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'unité",
        variant: "destructive"
      })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-units", id] })
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès"
      })
    },
    onError: (error) => {
      console.error("Error deleting unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'unité",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = async (unitData: ApartmentUnit) => {
    if (!id) return
    const data = {
      ...unitData,
      apartment_id: id
    }
    if (editingUnit) {
      await updateUnit.mutateAsync(data)
    } else {
      await createUnit.mutateAsync(data)
    }
  }

  const handleEdit = (unit: ApartmentUnit) => {
    setEditingUnit(unit)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setEditingUnit(undefined)
    setShowDialog(true)
  }

  if (!id) return null

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="grid gap-6">
        {apartment && <ApartmentInfo apartment={apartment} />}
        <Separator />
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
                isLoading={unitsLoading}
                onEdit={handleEdit}
                onDelete={(unitId) => deleteUnit.mutateAsync(unitId)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ApartmentUnitDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialData={editingUnit}
        apartmentId={id}
        onSubmit={handleSubmit}
        isEditing={!!editingUnit}
      />
    </AgencyLayout>
  )
}