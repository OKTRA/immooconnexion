export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled';
export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending';
export type PaymentType = 'rent' | 'deposit' | 'agency_fees';

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
  paymentMethod?: PaymentMethod;
  notes?: string;
  periodStart?: string;
  periodEnd?: string;
  type: PaymentType;
}

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  latePayments: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: string;
  };
}