import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ApartmentUnit } from "@/types/apartment"

function ApartmentUnits() {
  const { id } = useParams()
  const { toast } = useToast()
  const [showUnitDialog, setShowUnitDialog] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null)

  const { data: units = [], refetch } = useQuery({
    queryKey: ["apartment-units", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_units")
        .select("*")
        .eq("apartment_id", id)

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les unités d'appartement",
          variant: "destructive",
        })
        throw error
      }

      return data
    },
  })

  const handleEditUnit = (unit: ApartmentUnit) => {
    setSelectedUnit(unit)
    setShowUnitDialog(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Unités d'appartement</h1>
      <Button onClick={() => {
        setSelectedUnit(null)
        setShowUnitDialog(true)
      }}>
        Ajouter une unité
      </Button>
      <ul>
        {units.map((unit) => (
          <li key={unit.id}>
            <span>{unit.unit_number}</span>
            <Button onClick={() => handleEditUnit(unit)}>Modifier</Button>
          </li>
        ))}
      </ul>

      <ApartmentUnitDialog
        open={showUnitDialog}
        onOpenChange={setShowUnitDialog}
        selectedUnit={selectedUnit}
        apartmentId={id!}
        onSuccess={() => {
          setShowUnitDialog(false)
          refetch()
        }}
      />
    </div>
  )
}

export default ApartmentUnits
