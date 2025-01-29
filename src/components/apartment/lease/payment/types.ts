import { PaymentMethod } from "@/types/payment";

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
  payment_frequency: string;
  duration_type: string;
  status: string;
  payment_type: string;
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

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    due_date: string;
  };
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

export interface LeaseHeaderProps {
  lease: LeaseData;
  onInitialPayment: () => void;
  onRegularPayment: () => void;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  lease: LeaseData;
}

export interface PaymentFormProps {
  leaseId: string;
  lease: LeaseData;
  onSuccess?: () => void;
  isHistorical?: boolean;
}

export interface CurrentPaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface HistoricalPaymentFormProps extends CurrentPaymentFormProps {}

export interface LatePaymentFormProps extends CurrentPaymentFormProps {}

export interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  hasLatePayments?: boolean;
  latePaymentsCount?: number;
  totalLateAmount?: number;
}

export type PaymentType = 'current' | 'historical' | 'late';