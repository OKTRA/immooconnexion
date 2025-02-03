import { PaymentMethod } from '@/types/payment';

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type PaymentType = 'upfront' | 'end_of_period';
export type LeaseStatus = 'active' | 'expired' | 'terminated';

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
  status: 'pending' | 'paid' | 'late' | 'due_soon';
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
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
  duration_type: DurationType;
  status: LeaseStatus;
  payment_type: PaymentType;
  agency_id: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    email?: string;
    status: string;
  };
  unit?: {
    id: string;
    unit_number: string;
    apartment?: {
      id: string;
      name: string;
    };
  };
  initial_fees_paid?: boolean;
  initial_payments_completed?: boolean;
  initialPayments?: PaymentListItem[];
  regularPayments?: PaymentListItem[];
  currentPeriod?: PaymentListItem;
}

export interface PaymentListItem {
  id: string;
  amount: number;
  status: string;
  payment_date?: string;
  due_date: string;
  payment_period_start?: string;
  payment_period_end?: string;
  type?: 'deposit' | 'agency_fees' | 'rent';
  payment_method?: PaymentMethod;
  payment_type?: string;
  displayStatus?: string;
  first_rent_start_date?: string;
}

export interface LeasePaymentViewProps {
  leaseId: string;
}

export interface PaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isHistorical?: boolean;
}

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';

export interface PaymentListProps {
  title: string;
  payments: PaymentListItem[];
  className?: string;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentListItem) => void;
}