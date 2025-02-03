export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled';
export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending';

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  latePayments: number;
  lateAmount: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: string;
  };
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'pending' | 'late' | 'paid' | 'due_soon';
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface PaymentFormProps {
  lease: ApartmentLease;
  onSuccess?: () => void;
  isHistorical?: boolean;
}

export interface HistoricalPaymentFormProps {
  lease: ApartmentLease;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface LeasePaymentViewProps {
  leaseId: string;
}