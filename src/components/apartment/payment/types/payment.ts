export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";

export interface PeriodOption {
  value: number;
  label: string;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  tenantId?: string;
  paymentType?: 'rent' | 'deposit' | 'agency_fees';
}