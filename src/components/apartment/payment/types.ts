import { PaymentMethod } from "@/types/payment";

export interface PaymentFormData {
  leaseId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentPeriods: string[];
  notes?: string;
  agencyId?: string;
  isHistorical?: boolean;
}

export interface PaymentFormFieldsProps {
  formData: PaymentFormData;
  setFormData: (data: PaymentFormData) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  lease: any;
}

export interface PaymentListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
}

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  latePayments: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: string;
  };
}