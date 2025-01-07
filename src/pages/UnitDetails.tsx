import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { TenantPaymentsTab } from "@/components/apartment/tenant/TenantPaymentsTab"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unitDetails, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select(`
          *,
          apartment:apartments(name),
          current_lease:apartment_leases(
            *,
            tenant:apartment_tenants(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  if (isLoadingUnit) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </AgencyLayout>
    )
  }

  const currentTenant = unitDetails?.current_lease?.[0]?.tenant

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Unité {unitDetails?.unit_number} - {unitDetails?.apartment?.name}
          </h1>
          <p className="text-muted-foreground">
            Détails et gestion de l'unité
          </p>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tenant">Locataire</TabsTrigger>
            {currentTenant && <TabsTrigger value="payments">Paiements</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'unité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Numéro d'unité</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.unit_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Étage</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.floor_number || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surface</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.area || "-"} m²</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Loyer</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.rent_amount?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Caution</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.deposit_amount?.toLocaleString() || "-"} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Statut</p>
                    <Badge>{unitDetails?.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenant">
            <UnitTenantTab unitId={id!} />
          </TabsContent>

          {currentTenant && (
            <TabsContent value="payments">
              <TenantPaymentsTab tenantId={currentTenant.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AgencyLayout>
  )
}