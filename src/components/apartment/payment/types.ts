export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';
export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    due_date: string;
  };
}

export interface PaymentListItem {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
  payment_date?: string;
  due_date: string;
  payment_period_start?: string;
  payment_period_end?: string;
  type?: 'deposit' | 'agency_fees' | 'rent';
  payment_method?: PaymentMethod;
}

export interface PaymentListProps {
  title: string;
  payments: PaymentListItem[];
  className?: string;
  periodFilter?: PaymentPeriodFilter;
  statusFilter?: PaymentStatusFilter;
  leaseId?: string;
}

export interface LeasePaymentViewProps {
  leaseId: string;
}

export interface LeaseData {
  id: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
  };
  unit: {
    id: string;
    unit_number: string;
    apartment: {
      id: string;
      name: string;
    };
  };
  initial_payments_completed?: boolean;
  rent_amount: number;
  tenant_id: string;
  agency_id: string;
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
}

export interface PaymentFormProps {
  onSuccess?: () => void;
  leaseId: string;
  isHistorical?: boolean;
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';