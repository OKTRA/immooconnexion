import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LeaseData, PaymentListItem } from "../types";

export function useLeaseQueries() {
  return useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      console.log("Fetching leases and payments...");
      
      const { data: leaseData, error: leaseError } = await supabase
        .from("lease_details")
        .select(`
          *,
          tenant:apartment_tenants(
            id,
            first_name,
            last_name,
            phone_number,
            email,
            status
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
        .order("created_at", { ascending: false });

      if (leaseError) {
        console.error("Error fetching leases:", leaseError);
        throw leaseError;
      }

      // Fetch payments for each lease
      const leasesWithPayments = await Promise.all(
        leaseData.map(async (lease) => {
          const { data: payments, error: paymentsError } = await supabase
            .from("apartment_lease_payments")
            .select("*")
            .eq("lease_id", lease.id)
            .order("payment_period_start", { ascending: true });

          if (paymentsError) {
            console.error("Error fetching payments for lease:", lease.id, paymentsError);
            throw paymentsError;
          }

          const initialPayments = payments?.filter(p => 
            p.payment_type === 'deposit' || p.payment_type === 'agency_fees'
          ).map(p => ({
            ...p,
            type: p.payment_type,
            displayStatus: p.payment_status_type || p.status
          })) as PaymentListItem[];
          
          const regularPayments = payments?.filter(p => 
            p.payment_type !== 'deposit' && p.payment_type !== 'agency_fees'
          ).map(p => ({
            ...p,
            displayStatus: p.payment_status_type || p.status
          })) as PaymentListItem[];

          const currentPeriod = regularPayments.find(p => {
            if (!p.payment_period_start || !p.payment_period_end) return false;
            const start = new Date(p.payment_period_start);
            const end = new Date(p.payment_period_end);
            const now = new Date();
            return now >= start && now <= end;
          });

          return {
            ...lease,
            initialPayments,
            regularPayments,
            currentPeriod
          } as LeaseData;
        })
      );

      console.log("Fetched leases with payments:", leasesWithPayments);
      return leasesWithPayments;
    },
  });
}