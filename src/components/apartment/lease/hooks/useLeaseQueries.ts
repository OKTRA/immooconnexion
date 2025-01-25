import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function useLeaseQueries() {
  const { data: leases = [], isLoading } = useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      console.log("Fetching leases and payments...")
      
      const { data: leaseData, error: leaseError } = await supabase
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
          ),
          payments:apartment_lease_payments(
            id,
            amount,
            due_date,
            payment_date,
            status,
            type,
            payment_method,
            payment_period_start,
            payment_period_end
          ),
          payment_periods:apartment_payment_periods(
            id,
            start_date,
            end_date,
            amount,
            status
          )
        `)
        .order("created_at", { ascending: false })

      if (leaseError) {
        console.error("Error fetching leases:", leaseError)
        throw leaseError
      }

      // Pour chaque bail, récupérer les autres baux du même locataire
      const leasesWithRelated = await Promise.all(
        leaseData.map(async (lease) => {
          const { data: otherLeases, error: otherLeasesError } = await supabase
            .from("apartment_leases")
            .select(`
              *,
              unit:apartment_units(
                id,
                unit_number,
                apartment:apartments(
                  id,
                  name
                )
              )
            `)
            .eq("tenant_id", lease.tenant.id)
            .neq("id", lease.id)
            .eq("status", "active")

          if (otherLeasesError) {
            console.error("Error fetching other leases:", otherLeasesError)
            return lease
          }

          // Séparer les paiements par type
          const payments = lease.payments || []
          const initialPayments = payments.filter(p => 
            p.type === 'deposit' || p.type === 'agency_fees'
          )
          const regularPayments = payments.filter(p => 
            p.type !== 'deposit' && p.type !== 'agency_fees'
          )

          return {
            ...lease,
            other_leases: otherLeases || [],
            initialPayments,
            regularPayments
          }
        })
      )

      console.log("Fetched leases with payments:", leasesWithRelated)
      return leasesWithRelated
    },
  })

  return {
    leases,
    isLoading
  }
}