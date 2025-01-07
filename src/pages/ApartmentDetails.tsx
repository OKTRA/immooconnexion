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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Apartment, ApartmentUnit } from "@/types/apartment"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ApartmentDetails() {
  const { id = "" } = useParams()
  const { toast } = useToast()
  const [showDialog, setShowDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<ApartmentUnit | undefined>()

  const { data: units = [], isLoading: unitsLoading, createUnit, updateUnit, deleteUnit } = useApartmentUnits(id)

  const { data: apartment, isLoading: apartmentLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
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

  const handleSubmit = async (unitData: ApartmentUnit) => {
    try {
      if (editingUnit) {
        await updateUnit.mutateAsync(unitData)
        toast({
          title: "Succès",
          description: "L'unité a été mise à jour avec succès"
        })
      } else {
        await createUnit.mutateAsync(unitData)
        toast({
          title: "Succès",
          description: "L'unité a été créée avec succès"
        })
      }
      setShowDialog(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (unitId: string) => {
    try {
      await deleteUnit.mutateAsync(unitId)
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès"
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'unité",
        variant: "destructive"
      })
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
                onDelete={handleDelete}
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