import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentUnit, ApartmentUnitStatus } from "@/components/apartment/types"

export default function UnitDetails() {
  const { unitId } = useParams()

  // First query: Get basic unit information
  const { data: unitBasicData, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-basic', unitId],
    queryFn: async () => {
      if (!unitId) throw new Error("ID de l'unité manquant")

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          *,
          apartment:apartments (
            id,
            name
          )
        `)
        .eq("id", unitId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching unit:', error)
        throw error
      }

      if (!data) {
        throw new Error("Unité non trouvée")
      }

      return data
    },
    enabled: !!unitId
  })

  // Second query: Get current lease information separately
  const { data: currentLease, isLoading: isLoadingLease } = useQuery({
    queryKey: ['unit-lease', unitId],
    queryFn: async () => {
      if (!unitId) return null

      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          id,
          tenant:apartment_tenants (
            id,
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
            profession
          ),
          start_date,
          end_date,
          rent_amount,
          deposit_amount,
          status
        `)
        .eq("unit_id", unitId)
        .eq("status", "active")
        .maybeSingle()

      if (error) {
        console.error('Error fetching lease:', error)
        return null
      }

      return data
    },
    enabled: !!unitId
  })

  const isLoading = isLoadingUnit || isLoadingLease

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (!unitBasicData) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-muted-foreground">Unité non trouvée</p>
        </div>
      </AgencyLayout>
    )
  }

  // Combine the data
  const unitData: ApartmentUnit = {
    ...unitBasicData,
    status: unitBasicData.status as ApartmentUnitStatus,
    current_lease: currentLease
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <UnitHeader unit={unitData} />
        <div className="mt-6">
          <UnitDetailsTab unit={unitData} />
        </div>
      </div>
    </AgencyLayout>
  )
}