export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'late' | 'pending';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatusType;
  penalties?: PaymentPenalty[];
}

export interface PaymentPenalty {
  id: string;
  amount: number;
  daysLate: number;
  periodId: string;
  status: 'pending' | 'paid' | 'waived';
  calculatedAt: Date;
}

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  notes?: string;
  isHistorical?: boolean;
  periodStart?: Date;
  periodEnd?: Date;
  tenantId?: string;
  initialPayment?: boolean;
}

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  periodsCount: number;
}

export interface LeasePaymentStats {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
}

export interface PaymentListProps {
  title: string;
  payments: Array<{
    id: string;
    amount: number;
    status: PaymentStatusType;
    paymentDate?: Date;
    dueDate: Date;
    periodStart?: string;
    periodEnd?: string;
  }>;
  className?: string;
}

export interface LeaseData {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: string;
  status: string;
  payment_type: string;
  agency_id: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
  unit: {
    id: string;
    unit_number: string;
    apartment: {
      id: string;
      name: string;
    };
  };
}

export interface PeriodOption {
  id: string;
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatusType;
}

export interface PaymentFormProps {
  onSuccess?: () => void;
  leaseId: string;
  isHistorical?: boolean;
  tenantId?: string;
  initialPayment?: boolean;
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (leaseId: string) => void;
  isLoading: boolean;
}

export interface RegularPaymentsListProps {
  payments: Array<{
    id: string;
    amount: number;
    status: PaymentStatusType;
    payment_date?: string;
    due_date: string;
    payment_period_start?: string;
    payment_period_end?: string;
  }>;
}