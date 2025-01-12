import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentUnit } from "@/types/apartment"

export default function UnitDetails() {
  const { unitId } = useParams()

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', unitId],
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

      return data as ApartmentUnit & { apartment?: { name: string } }
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

  if (!unit) {
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
        <UnitHeader unit={unit} />
        <div className="mt-6">
          <UnitDetailsTab unit={unit} />
        </div>
      </div>
    </AgencyLayout>
  )
}