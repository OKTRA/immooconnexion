import { PaymentMethod } from "@/types/payment";

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type PaymentStatusType = 'upfront' | 'end_of_period';
export type LeaseStatus = 'active' | 'expired' | 'terminated';

export interface LeasePaymentViewProps {
  leaseId: string;
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
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
  payment_type: PaymentStatusType;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    email?: string;
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
  agency_id: string;
  currentPeriod?: {
    id: string;
    payment_period_start: string;
    payment_period_end: string;
    amount: number;
    status: string;
    payment_status_type?: string;
  };
  initialPayments?: PaymentListItem[];
  regularPayments?: PaymentListItem[];
}

export interface PaymentListProps {
  title: string;
  payments: PaymentListItem[];
  className?: string;
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
}

export interface PaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface PaymentTypeSelectorProps {
  value: 'current' | 'historical' | 'late';
  onChange: (value: 'current' | 'historical' | 'late') => void;
  hasLatePayments?: boolean;
  latePaymentsCount?: number;
  totalLateAmount?: number;
}

export interface LatePaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface HistoricalPaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface LeaseHeaderProps {
  lease: LeaseData;
  onInitialPayment: () => void;
}