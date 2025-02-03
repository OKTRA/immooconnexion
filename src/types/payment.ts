export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled';
export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending';
export type PaymentType = 'rent' | 'deposit' | 'agency_fees';

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  latePayments: number;
  lateAmount: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: string;
  };
  rentAmount?: number;
  penaltiesAmount?: number;
  periodsCount?: number;
  totalAmount?: number;
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatus;
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  notes?: string;
  isHistorical?: boolean;
  paymentType: PaymentType;
  periodStart?: Date;
  periodEnd?: Date;
}

export interface PaymentHistoryEntry {
  id: string;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
  date?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  periodStart?: string;
  periodEnd?: string;
  type: PaymentType;
}