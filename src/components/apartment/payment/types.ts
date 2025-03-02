
import { PaymentMethod } from "@/types/payment";
import { LeaseData, PaymentPeriodFilter, PaymentStatusFilter, PaymentFormData, PaymentPeriod, PeriodOption, PaymentSummary } from "../lease/payment/types";

export interface PaymentActionButtonProps {
  leaseId: string;
  tenantId?: string;
}

export interface LeaseSelectProps {
  value: string;
  onChange: (value: string) => void;
  filter?: (lease: LeaseData) => boolean;
  leases?: LeaseData[];
  selectedLeaseId?: string;
  onLeaseSelect?: (value: string) => void;
  isLoading?: boolean;
}

export interface PaymentPeriodsListProps {
  selectedPeriods: PaymentPeriod[];
  onPeriodSelect: (period: PaymentPeriod) => void;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  tenantId?: string;
}

export interface UsePaymentFormProps {
  onSuccess?: () => void;
}

export interface PaymentListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
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

export interface RegularPaymentsListProps {
  title: string;
  payments: any[];
  className?: string;
  onPaymentClick?: (payment: any) => void;
}

export type { LeaseData, PaymentPeriodFilter, PaymentStatusFilter, PaymentFormData, PaymentPeriod, PeriodOption, PaymentSummary };
