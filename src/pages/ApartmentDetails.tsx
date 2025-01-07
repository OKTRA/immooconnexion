import { useParams, Navigate } from "react-router-dom"
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
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  
  // Validate ID format (basic UUID validation)
  const isValidUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  if (!isValidUUID) {
    return <Navigate to="/agence/appartements" replace />
  }

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

  const handleEdit = (unit: ApartmentUnit) => {
    // This function is required by the interface but the actual edit handling
    // is done through onUpdateUnit. We pass the unit through to maintain the interface.
    console.log("Edit unit:", unit)
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
                onEdit={handleEdit}
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