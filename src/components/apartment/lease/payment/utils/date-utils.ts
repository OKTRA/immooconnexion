import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { PaymentFrequency } from "../types/payment-period";

export const calculateNextPeriod = (currentEnd: Date, frequency: PaymentFrequency): Date => {
  switch(frequency) {
    case 'daily': return addDays(currentEnd, 1);
    case 'weekly': return addWeeks(currentEnd, 1);
    case 'monthly': return addMonths(currentEnd, 1);
    case 'quarterly': return addMonths(currentEnd, 3);
    case 'biannual': return addMonths(currentEnd, 6);
    case 'yearly': return addYears(currentEnd, 1);
  }
};

export const calculatePeriodEnd = (start: Date, frequency: PaymentFrequency): Date => {
  switch(frequency) {
    case 'daily': return start;
    case 'weekly': return addDays(start, 6);
    case 'monthly': return addDays(addMonths(start, 1), -1);
    case 'quarterly': return addDays(addMonths(start, 3), -1);
    case 'biannual': return addDays(addMonths(start, 6), -1);
    case 'yearly': return addDays(addYears(start, 1), -1);
  }
};

export const isOverlapping = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return (
    (start1 >= start2 && start1 <= end2) ||
    (end1 >= start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
};