export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
export type PaymentStatusType = 'pending' | 'paid_current' | 'paid_advance' | 'late' | 'cancelled';

export interface PaymentPenalty {
  id: string;
  amount: number;
  daysLate: number;
  calculatedAt: Date;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatusType;
  penalties?: PaymentPenalty[];
  paidAmount?: number;
  remainingAmount?: number;
}

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    due_date: string;
  };
}