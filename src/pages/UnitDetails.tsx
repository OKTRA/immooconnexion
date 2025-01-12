import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UnitDetails() {
  const { apartmentId, unitId } = useParams()

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      console.log('Fetching unit details for:', unitId)
      
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
        .eq("apartment_id", apartmentId)
        .single()

      if (error) {
        console.error('Error fetching unit:', error)
        throw error
      }

      console.log('Unit data:', data)
      return data
    },
    enabled: !!unitId && !!apartmentId
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
      <UnitHeader unit={unit} />
      
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="tenant">Locataire</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <UnitDetailsTab unit={unit} />
        </TabsContent>

        <TabsContent value="tenant">
          <UnitTenantTab unit={unit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}