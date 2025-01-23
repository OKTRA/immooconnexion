import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { ApartmentTenant, ApartmentLease } from "@/types/apartment"

export function useApartmentTenant(tenantId: string) {
  const { data: tenant, isLoading: isLoadingTenant } = useQuery({
    queryKey: ["apartment-tenant", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("id", tenantId)
        .maybeSingle()

      if (error) {
        console.error("Error fetching tenant:", error)
        throw error
      }

      console.log("Fetched tenant:", data)
      return data as ApartmentTenant
    },
    enabled: !!tenantId
  })

  const { data: currentLease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["tenant-lease", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("status", "active")
        .maybeSingle()

      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }

      console.log("Fetched lease:", data)
      return data as ApartmentLease | null
    },
    enabled: !!tenantId
  })

  return {
    tenant,
    currentLease,
    isLoading: isLoadingTenant || isLoadingLease
  }
}