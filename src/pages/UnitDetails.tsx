import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { TenantPaymentsTab } from "@/components/apartment/tenant/TenantPaymentsTab"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { ApartmentUnit, ApartmentUnitStatus } from "@/components/apartment/types"
import { UnitHeader } from "@/components/apartment/unit/UnitHeader"
import { UnitDetailsTab } from "@/components/apartment/unit/UnitDetailsTab"

interface UnitDetailsData extends ApartmentUnit {
  apartment: {
    name: string;
  };
  current_lease?: Array<{
    id: string;
    status: string;
    tenant: {
      id: string;
      first_name: string;
      last_name: string;
    };
  }>;
}

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unitDetails, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No unit ID provided')

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
        .maybeSingle()

      if (error) throw error
      return data as UnitDetailsData
    },
    enabled: Boolean(id)
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

  if (!unitDetails) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <div className="text-center py-8 text-gray-500">
            Unité non trouvée
          </div>
        </div>
      </AgencyLayout>
    )
  }

  const currentTenant = unitDetails?.current_lease?.[0]?.tenant
  const hasActiveLease = currentTenant && unitDetails?.current_lease?.[0]?.status === 'active'

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <UnitHeader 
          unitNumber={unitDetails?.unit_number || ''} 
          apartmentName={unitDetails?.apartment?.name || ''}
        />

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tenant">Locataire</TabsTrigger>
            {currentTenant && <TabsTrigger value="payments">Paiements</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <UnitDetailsTab 
              unit={unitDetails} 
              hasActiveLease={hasActiveLease}
            />
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