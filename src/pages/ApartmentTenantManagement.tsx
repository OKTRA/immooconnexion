import { useParams } from "react-router-dom";
import { AgencyLayout } from "@/components/agency/AgencyLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApartmentTenantsTab } from "@/components/apartment/tabs/ApartmentTenantsTab";
import { Loader2 } from "lucide-react";
import { ApartmentTenant } from "@/types/apartment";

export default function ApartmentTenantManagement() {
  const { id: apartmentId } = useParams<{ id: string }>();

  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            tenant_id,
            unit_id,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            payment_frequency,
            duration_type,
            status,
            payment_type,
            agency_id
          )
        `)
        .eq("apartment_id", apartmentId);

      if (error) throw error;
      return data as ApartmentTenant[];
    },
    enabled: !!apartmentId
  });

  if (!apartmentId) {
    return <div>Apartment ID is required</div>;
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentTenantsTab
          apartmentId={apartmentId}
          onDeleteTenant={async (id) => {
            await supabase
              .from("apartment_tenants")
              .delete()
              .eq("id", id);
          }}
          onEditTenant={() => {}}
          isLoading={tenantsLoading}
        />
      </div>
    </AgencyLayout>
  );
}