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

export interface PaymentNotification {
  id: string;
  lease_id: string;
  type: "late_payment" | "upcoming_payment";
  amount: number;
  due_date: string;
  is_read: boolean;
  created_at: string;
}

export interface LateFee {
  id: string;
  lease_id: string;
  payment_id: string;
  amount: number;
  days_late: number;
  status: "pending" | "paid";
  created_at: string;
}