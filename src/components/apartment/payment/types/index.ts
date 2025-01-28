import { PaymentMethod } from "@/types/payment"

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    due_date: string;
  }
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

export interface PeriodOption {
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'late' | 'future';
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
  payment_type: string;
  status: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
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
}

export interface PaymentListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: any) => void;
}