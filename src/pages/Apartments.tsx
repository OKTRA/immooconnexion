import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentList } from "@/components/apartment/ApartmentList"
import { ApartmentUnitsDialog } from "@/components/apartment/ApartmentUnitsDialog"

export default function Apartments() {
  const { toast } = useToast()
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null)
  const [showUnitsDialog, setShowUnitsDialog] = useState(false)

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data: apartmentsData, error: apartmentsError } = await supabase
        .from("apartments")
        .select("*")
        .eq("agency_id", userProfile.agency_id)
        .order("created_at", { ascending: false })

      if (apartmentsError) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les appartements",
          variant: "destructive",
        })
        throw apartmentsError
      }

      // Get unit counts for each apartment
      const apartmentsWithUnits = await Promise.all(
        apartmentsData.map(async (apartment) => {
          const { count } = await supabase
            .from("apartment_units")
            .select("*", { count: "exact", head: true })
            .eq("apartment_id", apartment.id)

          return {
            ...apartment,
            unit_count: count || 0
          }
        })
      )

      return apartmentsWithUnits
    },
  })

  const { 
    data: units = [], 
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(selectedApartmentId || undefined)

  const handleViewUnits = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId)
    setShowUnitsDialog(true)
  }

  return (
    <AgencyLayout>
      <ApartmentHeader />
      
      <ApartmentList
        apartments={apartments}
        isLoading={isLoading}
        onViewUnits={handleViewUnits}
      />

      {selectedApartmentId && (
        <ApartmentUnitsDialog
          open={showUnitsDialog}
          onOpenChange={setShowUnitsDialog}
          selectedApartmentId={selectedApartmentId}
          units={units}
          unitsLoading={unitsLoading}
          onCreateUnit={createUnit.mutateAsync}
          onUpdateUnit={updateUnit.mutateAsync}
          onDeleteUnit={deleteUnit.mutateAsync}
        />
      )}
    </AgencyLayout>
  )
}