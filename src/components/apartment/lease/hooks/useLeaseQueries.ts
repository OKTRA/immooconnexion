import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function useLeaseQueries() {
  const { data: leases = [], isLoading } = useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      console.log("Fetching leases and payments...")
      
      const { data: leaseData, error: leaseError } = await supabase
        .from("lease_details")
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

      if (leaseError) {
        console.error("Error fetching leases:", leaseError)
        throw leaseError
      }

      // Fetch payments for each lease
      const leasesWithPayments = await Promise.all(
        leaseData.map(async (lease) => {
          const { data: payments, error: paymentsError } = await supabase
            .from("apartment_lease_payments")
            .select("*")
            .eq("lease_id", lease.id)
            .order("payment_date", { ascending: false })

          if (paymentsError) {
            console.error("Error fetching payments for lease:", lease.id, paymentsError)
            throw paymentsError
          }

          // Séparer les paiements par type
          const initialPayments = payments?.filter(p => 
            p.payment_type === 'deposit' || p.payment_type === 'agency_fees'
          ) || []
          
          const regularPayments = payments?.filter(p => 
            p.payment_type !== 'deposit' && p.payment_type !== 'agency_fees'
          ).map(p => ({
            ...p,
            displayStatus: p.payment_status_type || p.status
          })) || []

          return {
            ...lease,
            initialPayments,
            regularPayments
          }
        })
      )

      console.log("Fetched leases with payments:", leasesWithPayments)
      return leasesWithPayments
    },
  })

  return {
    leases,
    isLoading
  }
}