import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"
import { ApartmentUnit } from "@/components/apartment/types"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unit, isLoading } = useQuery({
    queryKey: ["unit", id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          *,
          apartment:apartments(name)
        `)
        .eq("id", id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching unit:", error)
        throw error
      }

      return data as ApartmentUnit & { apartment: { name: string } }
    },
    enabled: Boolean(id)
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <div>Chargement...</div>
        </div>
      </AgencyLayout>
    )
  }

  if (!unit) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <div>Unité non trouvée</div>
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <UnitHeader 
          unitNumber={unit.unit_number}
          apartmentName={unit.apartment?.name || ""}
        />

        <Tabs defaultValue="details" className="mt-6">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tenant">Locataire</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <UnitDetailsTab unit={unit} />
          </TabsContent>

          <TabsContent value="tenant">
            <UnitTenantTab unitId={id} />
          </TabsContent>

          <TabsContent value="payments">
            <div className="text-center py-8 text-muted-foreground">
              Fonctionnalité à venir
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}