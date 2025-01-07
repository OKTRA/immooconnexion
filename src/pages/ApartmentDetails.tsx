import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartmentDetails } from "@/hooks/use-apartment-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentPaymentsTab } from "@/components/apartment/tabs/ApartmentPaymentsTab"
import { ApartmentLateFeesTab } from "@/components/apartment/tabs/ApartmentLateFeesTab"
import { ApartmentDepositsTab } from "@/components/apartment/tabs/ApartmentDepositsTab"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  
  const {
    apartment,
    apartmentLoading,
    units,
    unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentDetails(id)

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
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="units">Unités</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
            <TabsTrigger value="deposits">Cautions</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            {apartment && <ApartmentInfo apartment={apartment} />}
          </TabsContent>

          <TabsContent value="units">
            <ApartmentUnitsSection
              apartmentId={id}
              units={units}
              isLoading={unitsLoading}
              onCreateUnit={(data) => createUnit.mutateAsync(data)}
              onUpdateUnit={(data) => updateUnit.mutateAsync(data)}
              onDeleteUnit={(unitId) => deleteUnit.mutateAsync(unitId)}
            />
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
        </Tabs>
      </div>
    </AgencyLayout>
  )
}