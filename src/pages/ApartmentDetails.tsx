import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { ApartmentUnitsTab } from "@/components/apartment/tabs/ApartmentUnitsTab"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  
  const { data: apartment, isLoading: apartmentLoading } = useApartment(id)
  const { 
    data: units = [], 
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(id)

  if (!id) return null

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentHeader 
          apartment={apartment}
          isLoading={apartmentLoading}
        />

        <Tabs defaultValue="units" className="mt-6">
          <TabsList>
            <TabsTrigger value="units">Unités</TabsTrigger>
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="units">
            <ApartmentUnitsTab
              apartmentId={id}
              units={units}
              isLoading={unitsLoading}
              onCreateUnit={async (data) => {
                await createUnit.mutateAsync(data)
              }}
              onUpdateUnit={async (data) => {
                await updateUnit.mutateAsync(data)
              }}
              onDeleteUnit={async (unitId) => {
                await deleteUnit.mutateAsync(unitId)
              }}
            />
          </TabsContent>

          <TabsContent value="tenants">
            <ApartmentTenantsTab
              apartmentId={id}
              isLoading={false}
              tenants={[]}
              onDeleteTenant={() => {}}
              onEditTenant={() => {}}
            />
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