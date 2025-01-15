export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming";
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money";

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
}

export interface LeaseData {
  id: string;
  rent_amount: number;
  tenant_id: string;
  unit_id: string;
  payment_frequency: string;
  apartment_tenants: {
    first_name: string;
    last_name: string;
  };
  apartment_units: {
    unit_number: string;
    apartment: {
      name: string;
    };
  };
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading?: boolean;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}