import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PaymentPeriod } from "../types";

export function usePaymentPeriods(leaseId: string) {
  return useQuery({
    queryKey: ["lease-payment-periods", leaseId],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("payment_type", "rent")
        .order("payment_period_start", { ascending: true });

      if (error) throw error;

      return payments.map((payment): PaymentPeriod => ({
        id: payment.id,
        startDate: new Date(payment.payment_period_start),
        endDate: new Date(payment.payment_period_end),
        amount: payment.amount,
        status: payment.status,
        isPaid: payment.status === "paid",
        label: `${payment.payment_period_start} - ${payment.payment_period_end}`,
        paymentId: payment.id
      }));
    },
    enabled: !!leaseId
  });
}