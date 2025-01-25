export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";
export type PaymentType = "deposit" | "agency_fees" | "rent";
export type PaymentFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "biannual" | "yearly";
export type PaymentStatus = "pending" | "paid" | "late";

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  numberOfPeriods: number;
  notes?: string;
  isHistorical?: boolean;
  periodStart?: Date;
  periodEnd?: Date;
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
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
  unit: {
    id: string;
    unit_number: string;
    apartment?: {
      id: string;
      name: string;
    };
  };
}

export interface PeriodOption {
  value: number;
  label: string;
  startDate: Date;
  endDate: Date;
  amount: number;
}

export interface PaymentDetailsProps {
  selectedLease: LeaseData;
  selectedPeriods: number;
  isHistorical?: boolean;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  isHistorical?: boolean;
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export interface PaymentListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
}

export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";