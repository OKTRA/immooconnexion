import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";

export type PaymentPeriod = {
  startDate: Date;
  endDate: Date;
  amount: number;
  label: string;
  isPaid: boolean;
};

export function useLeasePeriods(lease: {
  start_date: string;
  end_date?: string;
  rent_amount: number;
  payment_frequency: string;
  duration_type: string;
}, existingPayments: Array<{
  payment_period_start: string;
  payment_period_end: string;
}> = []) {
  const periods = useMemo(() => {
    if (!lease) return [];

    const startDate = new Date(lease.start_date);
    const endDate = lease.end_date 
      ? new Date(lease.end_date)
      : addYears(startDate, 1);

    const calculateNextDate = (currentDate: Date): Date => {
      switch (lease.payment_frequency) {
        case 'daily':
          return addDays(currentDate, 1);
        case 'weekly':
          return addWeeks(currentDate, 1);
        case 'monthly':
          return addMonths(currentDate, 1);
        case 'quarterly':
          return addMonths(currentDate, 3);
        case 'yearly':
          return addYears(currentDate, 1);
        default:
          return addMonths(currentDate, 1);
      }
    };

    const periods: PaymentPeriod[] = [];
    let currentDate = startDate;

    while (currentDate < endDate) {
      const periodEndDate = calculateNextDate(currentDate);
      
      // Vérifier si cette période est déjà payée
      const isPaid = existingPayments.some(payment => {
        const paymentStart = new Date(payment.payment_period_start);
        const paymentEnd = new Date(payment.payment_period_end);
        return (
          paymentStart <= currentDate &&
          paymentEnd >= periodEndDate
        );
      });

      periods.push({
        startDate: currentDate,
        endDate: periodEndDate,
        amount: lease.rent_amount,
        label: `${format(currentDate, 'dd MMMM yyyy', { locale: fr })} - ${format(periodEndDate, 'dd MMMM yyyy', { locale: fr })}`,
        isPaid
      });

      currentDate = periodEndDate;
    }

    return periods;
  }, [lease, existingPayments]);

  return {
    periods,
    totalAmount: periods.reduce((sum, period) => sum + period.amount, 0),
    paidPeriodsCount: periods.filter(p => p.isPaid).length,
    remainingPeriodsCount: periods.filter(p => !p.isPaid).length,
  };
}