import { PaymentMethod } from "@/types/payment"

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  notes?: string;
  periodStart?: Date;
  periodEnd?: Date;
  isHistorical?: boolean;
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'late' | 'future';
}

export interface PeriodOption {
  id: string;
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'late' | 'future';
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
  payment_frequency: string;
  duration_type: string;
  payment_type: string;
  status: string;
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

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export interface PaymentListProps {
  title: string;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    payment_date?: string;
    due_date: string;
    payment_period_start?: string;
    payment_period_end?: string;
    type?: string;
  }>;
  className?: string;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: any) => void;
}