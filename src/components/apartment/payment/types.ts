
import { PaymentMethod } from "@/types/payment";
import { LeaseData, PaymentPeriodFilter, PaymentStatusFilter, PaymentFormData, PaymentPeriod, PeriodOption, PaymentSummary } from "../lease/payment/types";

export interface PaymentActionButtonProps {
  leaseId: string;
}

export interface LeaseSelectProps {
  value: string;
  onChange: (value: string) => void;
  filter?: (lease: LeaseData) => boolean;
}

export interface PaymentPeriodsListProps {
  periods: PaymentPeriod[];
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

export { LeaseData, PaymentPeriodFilter, PaymentStatusFilter, PaymentFormData, PaymentPeriod, PeriodOption, PaymentSummary };
