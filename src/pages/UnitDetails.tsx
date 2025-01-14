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

  const { data: unitData, isLoading } = useQuery({
    queryKey: ['unit-details', unitId],
    queryFn: async () => {
      if (!unitId) throw new Error("ID de l'unité manquant")

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          *,
          apartment:apartments (
            id,
            name
          ),
          current_lease:apartment_leases!apartment_leases_unit_id_fkey (
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
          )
        `)
        .eq("id", unitId)
        .eq("apartment_leases.status", "active")
        .maybeSingle()

      if (error) {
        console.error('Error fetching unit:', error)
        throw error
      }

      if (!data) {
        throw new Error("Unité non trouvée")
      }

      // Ensure status is of type ApartmentUnitStatus
      const formattedData: ApartmentUnit = {
        ...data,
        status: data.status as ApartmentUnitStatus,
        current_lease: data.current_lease ? {
          ...data.current_lease[0],
          tenant: data.current_lease[0]?.tenant
        } : undefined
      }

      return formattedData
    },
    enabled: !!unitId
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (!unitData) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-muted-foreground">Unité non trouvée</p>
        </div>
      </AgencyLayout>
    )
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