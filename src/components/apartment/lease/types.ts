export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending';
export type PaymentType = 'upfront' | 'end_of_period';

export interface LeaseFormData {
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount?: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  status: LeaseStatus;
  payment_type: PaymentType;
  deposit_returned?: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: string;
  deposit_return_notes?: string;
  agency_fees_percentage: number;
  commission_percentage: number;
}