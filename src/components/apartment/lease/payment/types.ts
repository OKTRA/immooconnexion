import { PaymentMethod } from "@/types/payment";
import { ApartmentLease } from "@/types/apartment";

export type PaymentType = 'current' | 'historical' | 'late';

export interface PaymentFormProps {
  onSuccess?: () => void;
  leaseId: string;
  lease: ApartmentLease;
  isHistorical?: boolean;
}

export interface CurrentPaymentFormProps {
  lease: ApartmentLease;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface HistoricalPaymentFormProps {
  lease: ApartmentLease;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface LatePaymentFormProps {
  lease: ApartmentLease;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
}