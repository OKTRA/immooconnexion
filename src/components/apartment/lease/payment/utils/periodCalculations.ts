import { addDays, addMonths, addYears } from "date-fns";
import { PaymentFrequency } from "../types";

export const calculatePeriodEndDate = (
  startDate: Date,
  frequency: PaymentFrequency
): Date => {
  const start = new Date(startDate);
  
  switch (frequency) {
    case 'daily':
      return start;
    case 'weekly':
      return addDays(start, 6); // 7 jours au total
    case 'monthly':
      return addDays(addMonths(start, 1), -1); // Jusqu'à la veille du mois suivant
    case 'quarterly':
      return addDays(addMonths(start, 3), -1); // Jusqu'à la veille du trimestre suivant
    case 'biannual':
      return addDays(addMonths(start, 6), -1); // Jusqu'à la veille du semestre suivant
    case 'yearly':
      return addDays(addYears(start, 1), -1); // Jusqu'à la veille de l'année suivante
    default:
      return addDays(addMonths(start, 1), -1);
  }
};

export const getNextPeriodStart = (
  currentStartDate: Date,
  frequency: PaymentFrequency
): Date => {
  const start = new Date(currentStartDate);
  
  switch (frequency) {
    case 'daily':
      return addDays(start, 1);
    case 'weekly':
      return addDays(start, 7);
    case 'monthly':
      return addMonths(start, 1);
    case 'quarterly':
      return addMonths(start, 3);
    case 'biannual':
      return addMonths(start, 6);
    case 'yearly':
      return addYears(start, 1);
    default:
      return addMonths(start, 1);
  }
};