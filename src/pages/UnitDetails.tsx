import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentUnit, ApartmentUnitStatus } from "@/types/apartment"

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
          apartment:apartments(
            id,
            name,
            address
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

      return {
        ...data,
        status: data.status as ApartmentUnitStatus
      } as ApartmentUnit & { apartment?: { name: string; address: string } }
    },
    enabled: !!unitId
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!unit) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Unité non trouvée
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <UnitHeader unitNumber={unit.unit_number} apartmentName={unit.apartment?.name || ''} />
      
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="tenant">Locataire</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <UnitDetailsTab unit={unit} />
        </TabsContent>

        <TabsContent value="tenant">
          <UnitTenantTab unitId={unit.id} apartmentId={unit.apartment_id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}