import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApartmentTenant } from "@/types/apartment";
import { Loader2 } from "lucide-react";
import { ApartmentTenantsTable } from "./ApartmentTenantsTable";

export interface ApartmentTenantsTabProps {
  onDeleteTenant: (id: string) => Promise<void>;
  onEditTenant: (tenant: ApartmentTenant) => void;
  isLoading?: boolean;
}

export function ApartmentTenantsTab({ 
  onDeleteTenant,
  onEditTenant,
  isLoading: externalLoading
}: ApartmentTenantsTabProps) {
  const { data: tenants = [], isLoading: queryLoading } = useQuery({
    queryKey: ["apartment-tenants"],
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
          ),
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `);

      if (error) throw error;
      return data as ApartmentTenant[];
    }
  });

  const isLoading = externalLoading || queryLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ApartmentTenantsTable
      onEdit={onEditTenant}
      onDelete={onDeleteTenant}
      isLoading={isLoading}
    />
  );
}