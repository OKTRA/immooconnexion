export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";
export type PaymentType = "deposit" | "agency_fees" | "rent";

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

export interface InitialPayment {
  id: string;
  type: 'deposit' | 'agency_fees';
  amount: number;
  status: string;
  due_date: string;
  payment_date?: string;
}

export interface RegularPayment {
  id: string;
  amount: number;
  payment_period_start?: string;
  payment_period_end?: string;
  due_date: string;
  status: string;
  payment_date?: string;
}

export interface InitialPaymentsSectionProps {
  payments: InitialPayment[];
}

export interface RegularPaymentsListProps {
  payments: RegularPayment[];
}

export interface PaymentFiltersProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  onPeriodFilterChange: (value: PaymentPeriodFilter) => void;
  onStatusFilterChange: (value: PaymentStatusFilter) => void;
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
  unit: {
    id: string;
    apartment: {
      id: string;
      name: string;
    };
    unit_number: string;
  };
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}