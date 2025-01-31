import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApartmentLease } from "@/types/apartment";

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  paymentId?: string;
}

export function useLeasePeriods(lease: ApartmentLease) {
  return useQuery({
    queryKey: ["lease-payments", lease.id],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", lease.id)
        .eq("payment_type", "rent")
        .order("payment_period_start", { ascending: true });

      if (error) throw error;

      return payments.map(payment => ({
        id: payment.id,
        startDate: new Date(payment.payment_period_start),
        endDate: new Date(payment.payment_period_end),
        amount: payment.amount,
        status: payment.status,
        paymentId: payment.id
      }));
    },
    enabled: !!lease?.id
  });
}