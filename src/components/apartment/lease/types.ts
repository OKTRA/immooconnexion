export type PaymentType = "upfront" | "end_of_period";
export type PaymentFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type DurationType = "fixed" | "month_to_month" | "yearly";
export type LeaseStatus = "active" | "expired" | "terminated";

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  paymentFrequency: PaymentFrequency;
  durationType: DurationType;
  status: LeaseStatus;
  paymentType: PaymentType;
  depositReturnDate?: string;
  depositReturnAmount?: string;
  depositReturnNotes?: string;
  depositReturned: boolean;
}

export interface Lease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  status: LeaseStatus;
  deposit_returned: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
  agency_id: string;
  created_at: string;
  updated_at: string;
  payment_type: PaymentType;
  initial_fees_paid: boolean;
}