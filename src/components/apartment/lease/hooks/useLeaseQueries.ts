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
            .order("payment_period_start", { ascending: true })

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
            displayStatus: p.payment_status_type || p.status,
            periodLabel: p.payment_period_start && p.payment_period_end ? 
              `${new Date(p.payment_period_start).toLocaleDateString()} - ${new Date(p.payment_period_end).toLocaleDateString()}` : 
              undefined
          })) || []

          // Trouver la période en cours
          const now = new Date()
          const currentPeriod = regularPayments.find(p => {
            if (!p.payment_period_start || !p.payment_period_end) return false
            const start = new Date(p.payment_period_start)
            const end = new Date(p.payment_period_end)
            return now >= start && now <= end
          })

          console.log("Regular payments for lease:", lease.id, regularPayments)

          return {
            ...lease,
            initialPayments,
            regularPayments,
            currentPeriod
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