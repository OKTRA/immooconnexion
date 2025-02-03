import { PaymentMethod, PaymentPeriod, PaymentSummary } from '@/types/payment';
import { LeaseData } from '@/types/lease';

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

export interface PaymentPeriodsListProps {
  selectedPeriods: PaymentPeriod[];
  onPeriodSelect: (period: PaymentPeriod) => void;
  isLoading?: boolean;
}

export interface PaymentSummaryProps {
  summary: PaymentSummary;
  className?: string;
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