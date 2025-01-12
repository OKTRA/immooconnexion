import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/components/apartment/types"

export function useApartmentTenant(tenantId: string) {
  return useQuery({
    queryKey: ["apartment-tenant", tenantId],
    queryFn: async () => {
      console.log("Fetching tenant details for ID:", tenantId)

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          ),
          apartment_leases (
            id,
            tenant_id,
            unit_id,
            agency_id,
            start_date,
            end_date,
            rent_amount,
            deposit_amount,
            status,
            payment_frequency,
            duration_type,
            payment_type,
            initial_fees_paid
          )
        `)
        .eq("id", tenantId)
        .order('created_at', { ascending: false })
        .maybeSingle()

      if (error) {
        console.error("Error fetching tenant:", error)
        throw error
      }

      console.log("Tenant data:", data)
      return data as ApartmentTenant
    },
    enabled: !!tenantId
  })
}