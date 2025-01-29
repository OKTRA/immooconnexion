import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useLeasePaymentStatus(leaseId: string) {
  return useQuery({
    queryKey: ["lease-late-payments", leaseId],
    queryFn: async () => {
      const { data: latePayments, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .lt("payment_period_end", new Date().toISOString())
        .eq("status", "pending")

      if (error) {
        console.error("Error fetching late payments:", error)
        throw error
      }

      const totalLateAmount = latePayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      return {
        hasLatePayments: latePayments && latePayments.length > 0,
        latePaymentsCount: latePayments?.length || 0,
        totalLateAmount,
        latePayments: latePayments || []
      }
    },
    enabled: !!leaseId
  })
}