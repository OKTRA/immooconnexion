
import { PaymentMethod } from "@/types/payment";

export type PaymentType = 'current' | 'historical' | 'late';
export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'biannual';

export interface LeasePaymentViewProps {
  leaseId: string;
}

export interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  hasLatePayments?: boolean;
  latePaymentsCount?: number;
  totalLateAmount?: number;
}

export interface HistoricalPaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface LatePaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
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
  payment_status_type?: string;
  displayStatus?: string;
  first_rent_start_date?: string;
  periodStart?: string;
  periodEnd?: string;
  date?: string;
  notes?: string;
  paymentMethod?: string;
}

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
  initialPayments?: PaymentListItem[];
  regularPayments?: PaymentListItem[];
  currentPeriod?: PaymentListItem;
}

export interface PaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isHistorical?: boolean;
  leaseId?: string;
}

export interface PaymentFormData {
  leaseId: string;
  agencyId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: string;
  notes?: string;
  isHistorical?: boolean;
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
  totalAmount?: number;
  rentAmount?: number;
  penaltiesAmount?: number;
  periodsCount?: number;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  lease?: LeaseData;
  tenantId?: string;
}

export interface PaymentFormFieldsProps {
  formData: PaymentFormData;
  setFormData: (data: PaymentFormData) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  lease: LeaseData;
  disabled?: boolean;
}

export interface PaymentPeriodsListProps {
  selectedPeriods: PaymentPeriod[];
  onPeriodSelect: (period: PaymentPeriod) => void;
  isLoading?: boolean;
}

export interface PeriodOption {
  id: string;
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
}

export interface PaymentListProps {
  title: string;
  payments: PaymentListItem[];
  className?: string;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentListItem) => void;
}

export interface LeasePaymentContentProps {
  lease: LeaseData;
  initialPayments: PaymentListItem[];
  regularPayments: PaymentListItem[];
}

export interface LeaseHeaderProps {
  lease: LeaseData;
  onInitialPayment: () => void;
  onRegularPayment: () => void;
  canMakeRegularPayments: boolean;
  needsInitialPayments: boolean;
}
