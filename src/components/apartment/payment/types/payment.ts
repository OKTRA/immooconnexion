export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";

export interface TenantPaymentDetails {
  id: string | null;
  lease_id: string | null;
  amount: number | null;
  due_date: string | null;
  payment_date: string | null;
  status: string | null;
  type: string | null;
  payment_method: string | null;
  tenant_id: string | null;
  lease_rent_amount: number | null;
  lease_deposit_amount: number | null;
  payment_frequency: string | null;
  period_start: string | null;
  period_end: string | null;
  tenant_first_name: string | null;
  tenant_last_name: string | null;
  unit_number: string | null;
  apartment_name: string | null;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
}

export interface PaymentsListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  leaseId: string;
}

export interface PeriodOption {
  value: number;
  label: string;
}