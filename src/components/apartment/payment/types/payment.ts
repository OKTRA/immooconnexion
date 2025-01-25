export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";
export type PaymentStatusType = "paid_current" | "paid_advance" | "late" | "pending";

export interface PaymentPeriodPenalty {
  id: string;
  payment_period_id: string;
  amount: number;
  days_late: number;
  calculated_at: string;
  status: string;
}

export interface PaymentPeriod {
  id: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
  penalties?: PaymentPeriodPenalty[];
}

export interface PaymentSummary {
  baseAmount: number;
  penaltiesAmount: number;
  totalAmount: number;
  periodsCount: number;
}