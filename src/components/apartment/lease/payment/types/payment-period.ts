import { PaymentMethod } from "@/types/payment";

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'yearly';
export type PaymentStatus = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending' | 'late';

export interface PaymentPeriod {
  start: Date;
  end: Date;
  status: PaymentStatus;
  amount: number;
  isPaid: boolean;
}

export interface ExistingPayment {
  payment_period_start: Date;
  payment_period_end: Date;
  payment_status_type: PaymentStatus;
  amount: number;
}

export interface PaymentValidationResult {
  isValid: boolean;
  message?: string;
}