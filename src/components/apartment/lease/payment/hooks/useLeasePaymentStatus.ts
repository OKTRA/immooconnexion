import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLeasePaymentStatus(leaseId: string) {
  return useQuery({
    queryKey: ["lease-payment-status", leaseId],
    queryFn: async () => {
      console.log("Checking payment status for lease:", leaseId);
      
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("payment_type", "rent")
        .lt("payment_period_start", new Date().toISOString())
        .neq("status", "paid");

      if (error) {
        console.error("Error fetching late payments:", error);
        throw error;
      }

      const totalLateAmount = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      return {
        hasLatePayments: payments && payments.length > 0,
        latePaymentsCount: payments?.length || 0,
        totalLateAmount,
        latePayments: payments || []
      };
    },
    enabled: !!leaseId
  });
}