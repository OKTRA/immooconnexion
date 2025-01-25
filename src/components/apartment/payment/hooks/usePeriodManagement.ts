import { useState } from "react";
import { PeriodOption, PaymentFrequency } from "../types";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { fr } from "date-fns/locale";

export function usePeriodManagement() {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  const getMaxPeriods = (frequency: PaymentFrequency): number => {
    switch (frequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'biannual': return 2;
      case 'yearly': return 1;
      default: return 12;
    }
  };

  const generatePeriodOptions = (startDate: string, frequency: PaymentFrequency) => {
    const options: PeriodOption[] = [];
    const start = new Date(startDate);
    const maxPeriods = getMaxPeriods(frequency);
    
    for (let i = 1; i <= maxPeriods; i++) {
      let periodStart = new Date(start);
      let periodEnd: Date;

      switch (frequency) {
        case 'daily':
          periodEnd = addDays(periodStart, i);
          break;
        case 'weekly':
          periodEnd = addWeeks(periodStart, i);
          break;
        case 'monthly':
          periodEnd = addMonths(periodStart, i);
          break;
        case 'quarterly':
          periodEnd = addMonths(periodStart, i * 3);
          break;
        case 'biannual':
          periodEnd = addMonths(periodStart, i * 6);
          break;
        case 'yearly':
          periodEnd = addYears(periodStart, i);
          break;
        default:
          periodEnd = addMonths(periodStart, i);
      }

      options.push({
        value: i,
        label: `${i} ${
          frequency === 'monthly' ? 'mois' : 
          frequency === 'daily' ? 'jours' :
          frequency === 'weekly' ? 'semaines' :
          frequency === 'quarterly' ? 'trimestres' :
          frequency === 'biannual' ? 'semestres' :
          'années'
        }`,
        startDate: periodStart,
        endDate: periodEnd,
        amount: 0 // Will be calculated based on lease amount
      });
    }

    setPeriodOptions(options);
  };

  return {
    periodOptions,
    selectedPeriods,
    setSelectedPeriods,
    generatePeriodOptions,
    paymentDate,
    setPaymentDate
  };
}