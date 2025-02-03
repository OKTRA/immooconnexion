import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMonths, addWeeks, startOfMonth, endOfMonth, format } from "date-fns";
import { PaymentFrequency } from "@/components/apartment/types";

interface Period {
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'current' | 'late' | 'future';
}

export function usePaymentPeriods(leaseId: string) {
  return useQuery({
    queryKey: ["lease-payment-periods", leaseId],
    queryFn: async () => {
      console.log("Fetching payment periods for lease:", leaseId);

      // Récupérer les informations du bail et le first_rent_start_date
      const { data: leaseData, error: leaseError } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          apartment_lease_payments (
            payment_period_start,
            payment_period_end,
            payment_type,
            status
          )
        `)
        .eq("id", leaseId)
        .maybeSingle();

      if (leaseError) {
        console.error("Error fetching lease:", leaseError);
        throw leaseError;
      }

      if (!leaseData) {
        console.error("No lease found");
        return { periods: [], firstRentStartDate: null };
      }

      // Trouver le paiement de dépôt pour obtenir first_rent_start_date
      const depositPayment = leaseData.apartment_lease_payments.find(
        p => p.payment_type === 'deposit'
      );

      if (!depositPayment?.payment_period_start) {
        console.error("No deposit payment found with first_rent_start_date");
        return { periods: [], firstRentStartDate: null };
      }

      const firstRentStartDate = new Date(depositPayment.payment_period_start);
      const now = new Date();
      const periods: Period[] = [];

      // Générer les périodes en fonction de la fréquence
      let currentDate = new Date(firstRentStartDate);
      for (let i = 0; i < 12; i++) {
        let endDate: Date;
        
        if (leaseData.payment_frequency === 'monthly') {
          endDate = endOfMonth(currentDate);
          currentDate = startOfMonth(addMonths(currentDate, 1));
        } else if (leaseData.payment_frequency === 'weekly') {
          endDate = addWeeks(currentDate, 1);
          currentDate = addWeeks(currentDate, 1);
        } else {
          continue;
        }

        // Déterminer le statut de la période
        let status: Period['status'];
        if (currentDate < now) {
          status = 'late';
        } else if (format(currentDate, 'yyyy-MM') === format(now, 'yyyy-MM')) {
          status = 'current';
        } else {
          status = 'future';
        }

        periods.push({
          startDate: currentDate,
          endDate,
          amount: leaseData.rent_amount,
          status
        });
      }

      return {
        periods,
        firstRentStartDate,
        frequency: leaseData.payment_frequency as PaymentFrequency
      };
    }
  });
}