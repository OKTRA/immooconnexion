import { PaymentPeriod, ExistingPayment, PaymentValidationResult } from "../types/payment-period";
import { isOverlapping } from "./date-utils";

export const validatePeriodSelection = (
  selectedPeriod: PaymentPeriod,
  existingPayments: ExistingPayment[]
): PaymentValidationResult => {
  const hasOverlap = existingPayments.some(payment => 
    isOverlapping(
      selectedPeriod.start,
      selectedPeriod.end,
      payment.payment_period_start,
      payment.payment_period_end
    )
  );

  return {
    isValid: !hasOverlap,
    message: hasOverlap ? "Cette période chevauche un paiement existant" : undefined
  };
};

export const validateHistoricalPayment = (
  period: PaymentPeriod,
  existingPayments: ExistingPayment[],
  firstRentStartDate: Date
): PaymentValidationResult => {
  if (period.end >= firstRentStartDate) {
    return {
      isValid: false,
      message: "Un paiement historique doit être antérieur à la date de début du bail"
    };
  }

  return validatePeriodSelection(period, existingPayments);
};

export const validateAdvancePayment = (
  selectedPeriods: PaymentPeriod[],
  lastPaidPeriod?: PaymentPeriod
): PaymentValidationResult => {
  if (!lastPaidPeriod) {
    return {
      isValid: false,
      message: "Impossible de faire un paiement en avance sans paiement précédent"
    };
  }

  const hasInvalidPeriod = selectedPeriods.some(period => period.start <= lastPaidPeriod.end);
  
  return {
    isValid: !hasInvalidPeriod,
    message: hasInvalidPeriod ? "Toutes les périodes doivent être postérieures au dernier paiement" : undefined
  };
};

export const validatePaymentAmount = (
  period: PaymentPeriod,
  leaseAmount: number
): PaymentValidationResult => {
  return {
    isValid: period.amount === leaseAmount,
    message: period.amount !== leaseAmount ? "Le montant ne correspond pas au loyer du bail" : undefined
  };
};