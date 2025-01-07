import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentPaymentsTab } from "@/components/apartment/tabs/ApartmentPaymentsTab"
import { ApartmentLateFeesTab } from "@/components/apartment/tabs/ApartmentLateFeesTab"
import { ApartmentDepositsTab } from "@/components/apartment/tabs/ApartmentDepositsTab"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  
  const {
    data: apartment,
    isLoading: apartmentLoading
  } = useApartment(id)

  const {
    data: units = [],
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(id)

  if (!id) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">
            Sélectionnez un appartement pour voir les détails
          </p>
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <div className="container mx-auto py-6">
        <Tabs defaultValue="units" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="units">Unités</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
            <TabsTrigger value="deposits">Cautions</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="units">
              <ApartmentUnitsSection
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

            <TabsContent value="info" className="space-y-4">
              {apartment && <ApartmentInfo apartment={apartment} />}
            </TabsContent>

            <TabsContent value="payments">
              <ApartmentPaymentsTab />
            </TabsContent>

            <TabsContent value="late-fees">
              <ApartmentLateFeesTab apartmentId={id} />
            </TabsContent>

            <TabsContent value="deposits">
              <ApartmentDepositsTab apartmentId={id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}