import { PaymentMethod } from "@/types/payment";

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'biannual';

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

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

export interface LeasePaymentViewProps {
  leaseId: string;
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
  initialPayments?: Array<{
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
  }>;
  regularPayments?: Array<{
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
  }>;
  currentPeriod?: {
    id: string;
    amount: number;
    status: string;
    payment_date?: string;
    due_date: string;
    payment_period_start?: string;
    payment_period_end?: string;
  };
}

export interface PaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isHistorical?: boolean;
}

export interface HistoricalPaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  notes?: string;
  isHistorical?: boolean;
}