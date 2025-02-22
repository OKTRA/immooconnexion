
import { PaymentMethod, PaymentStatus, PaymentFrequency } from "@/types/payment";
import { LeaseData } from "@/types/lease";

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  notes?: string;
  isHistorical?: boolean;
}

export interface PaymentFormProps {
  lease: LeaseData;
  onSuccess?: () => void;
  isHistorical?: boolean;
}

export interface PaymentHistoryEntry {
  id: string;
  amount: number;
  payment_date: string;
  periodStart?: string;
  periodEnd?: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  date?: string;
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatus;
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface HistoricalPaymentFormProps extends PaymentFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export interface PaymentPeriodsListProps {
  selectedPeriods: PaymentPeriod[];
  onPeriodSelect: (period: PaymentPeriod) => void;
  isLoading?: boolean;
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

export interface PeriodOption {
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
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

export interface PaymentActionButtonProps {
  leaseId: string;
  onSuccess?: () => void;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  lease: LeaseData;
}

export interface LeasePaymentViewProps {
  leaseId: string;
}

export interface PaymentFormFieldsProps {
  formData: PaymentFormData;
  setFormData: (data: PaymentFormData) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentHistoryEntry) => void;
}

export { LeaseData };
