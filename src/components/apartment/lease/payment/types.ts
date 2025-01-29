import { PaymentMethod } from "@/types/payment";

export type PaymentType = 'current' | 'historical' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface LatePaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  hasLatePayments?: boolean;
  latePaymentsCount?: number;
  totalLateAmount?: number;
}

export interface LeaseData {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: string;
  status: string;
  payment_type: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    email?: string;
  };
  unit?: {
    id: string;
    unit_number: string;
    apartment?: {
      id: string;
      name: string;
    };
  };
  agency_id: string;
  initial_fees_paid?: boolean;
  initial_payments_completed?: boolean;
}