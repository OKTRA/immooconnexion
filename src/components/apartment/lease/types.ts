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