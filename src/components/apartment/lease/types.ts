export type DurationType = "fixed" | "month_to_month" | "yearly";
export type PaymentFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  paymentFrequency: PaymentFrequency;
  durationType: DurationType;
}

export interface Lease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  status: string;
  deposit_returned: boolean;
  agency_id: string;
  created_at: string;
  updated_at: string;
}