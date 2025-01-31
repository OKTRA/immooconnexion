export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';
export type PaymentStatus = 'pending' | 'paid' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PaymentPeriod {
  startDate: Date;
  endDate: Date;
  amount: number;
  isPaid: boolean;
  label: string;
}

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentPeriods: string[];
  notes?: string;
}