import { useParams, Navigate } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { useApartment } from "@/hooks/use-apartment"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentPaymentsTab } from "@/components/apartment/tabs/ApartmentPaymentsTab"
import { ApartmentLateFeesTab } from "@/components/apartment/tabs/ApartmentLateFeesTab"
import { ApartmentDepositsTab } from "@/components/apartment/tabs/ApartmentDepositsTab"
import { ApartmentUnitsTab } from "@/components/apartment/tabs/ApartmentUnitsTab"
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab"
import { useApartmentTenants } from "@/components/apartment/tenant/useApartmentTenants"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  
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

  const {
    data: tenants = [],
    isLoading: tenantsLoading,
    refetch: refetchTenants
  } = useApartmentTenants(id)

  const handleDeleteTenant = async (tenantId: string) => {
    try {
      const { error } = await supabase
        .from('apartment_tenants')
        .delete()
        .eq('id', tenantId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })

      refetchTenants()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
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
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
            <TabsTrigger value="deposits">Cautions</TabsTrigger>
          </TabsList>

          <div className="mt-6">
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
                onEdit={(unit: ApartmentUnit) => {
                  console.log("Edit unit:", unit)
                }}
              />
            </TabsContent>

            <TabsContent value="tenants">
              <ApartmentTenantsTab
                apartmentId={id}
                tenants={tenants}
                isLoading={tenantsLoading}
                onDeleteTenant={handleDeleteTenant}
                onEditTenant={(tenant) => {
                  console.log("Edit tenant:", tenant)
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