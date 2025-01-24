import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function useLeaseQueries() {
  const { data: leases = [], isLoading } = useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(
            id,
            first_name,
            last_name,
            phone_number
          ),
          unit:apartment_units(
            id,
            unit_number,
            apartment:apartments(
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching leases:", error)
        throw error
      }

      return data
    },
  })

  return {
    leases,
    isLoading
  }
}