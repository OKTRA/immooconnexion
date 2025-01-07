import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitTenantManager } from "@/components/apartment/unit-dialog/UnitTenantManager"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', id],
    queryFn: async () => {
      if (!id) throw new Error("ID non fourni")

      const { data, error } = await supabase
        .from('apartment_units')
        .select(`
          *,
          apartment:apartments(
            name,
            address
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center text-muted-foreground">Unité non trouvée</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Unité {unit.unit_number}
        </h1>
        <p className="text-muted-foreground">
          {unit.apartment.name} - {unit.apartment.address}
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="tenant">Locataire & Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informations sur l'unité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Numéro</p>
                  <p className="font-medium">{unit.unit_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Étage</p>
                  <p className="font-medium">{unit.floor_number || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Surface</p>
                  <p className="font-medium">{unit.area ? `${unit.area} m²` : 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyer</p>
                  <p className="font-medium">{unit.rent_amount.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Caution</p>
                  <p className="font-medium">
                    {unit.deposit_amount ? `${unit.deposit_amount.toLocaleString()} FCFA` : 'Non renseigné'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge>{unit.status}</Badge>
                </div>
              </div>

              {unit.description && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{unit.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant">
          <UnitTenantManager unitId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}