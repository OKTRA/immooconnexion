import { useState, useCallback } from "react";
import { PaymentPeriod, PaymentFrequency, PaymentStatus, ExistingPayment } from "../types/payment-period";
import { calculateNextPeriod, calculatePeriodEnd } from "../utils/date-utils";
import { validatePeriodSelection, validateHistoricalPayment, validateAdvancePayment } from "../utils/payment-validators";

export const usePeriodManagement = (
  firstRentStartDate: Date,
  frequency: PaymentFrequency,
  existingPayments: ExistingPayment[],
  leaseAmount: number
) => {
  const [selectedPeriods, setSelectedPeriods] = useState<PaymentPeriod[]>([]);

  const generateAvailablePeriods = useCallback((futureLimit: Date): PaymentPeriod[] => {
    const periods: PaymentPeriod[] = [];
    let currentStart = firstRentStartDate;

    while (currentStart <= futureLimit) {
      const periodEnd = calculatePeriodEnd(currentStart, frequency);
      const validation = validatePeriodSelection(
        {
          start: currentStart,
          end: periodEnd,
          status: 'pending',
          amount: leaseAmount,
          isPaid: false
        },
        existingPayments
      );

      if (validation.isValid) {
        periods.push({
          start: currentStart,
          end: periodEnd,
          status: 'pending',
          amount: leaseAmount,
          isPaid: false
        });
      }

      currentStart = calculateNextPeriod(periodEnd, frequency);
    }

    return periods;
  }, [firstRentStartDate, frequency, existingPayments, leaseAmount]);

  const selectPeriod = useCallback((period: PaymentPeriod) => {
    setSelectedPeriods(prev => [...prev, period]);
  }, []);

  const unselectPeriod = useCallback((period: PaymentPeriod) => {
    setSelectedPeriods(prev => 
      prev.filter(p => 
        p.start !== period.start || p.end !== period.end
      )
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPeriods([]);
  }, []);

  return {
    selectedPeriods,
    generateAvailablePeriods,
    selectPeriod,
    unselectPeriod,
    clearSelection
  };
};