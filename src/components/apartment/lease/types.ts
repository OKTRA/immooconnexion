export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month';
export type PaymentType = 'upfront' | 'end_of_period';

export interface LeaseFormData {
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  payment_type: PaymentType;
}