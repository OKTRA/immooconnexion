export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
}

export interface PaymentListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
}

export interface InitialPaymentsSectionProps {
  payments: Array<{
    id: string;
    type: 'deposit' | 'agency_fees';
    amount: number;
    status: string;
    due_date: string;
  }>;
}

export interface RegularPaymentsListProps {
  payments: Array<{
    id: string;
    amount: number;
    payment_period_start?: string;
    payment_period_end?: string;
    due_date: string;
    status: string;
  }>;
}

export interface PaymentFiltersProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  onPeriodFilterChange: (value: PaymentPeriodFilter) => void;
  onStatusFilterChange: (value: PaymentStatusFilter) => void;
}