export interface LeaseData {
  id: string;
  rent_amount: number;
  tenant_id: string;
  unit_id: string;
  payment_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
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

export interface PaymentFormProps {
  onSuccess?: () => void;
  tenantId: string;
}

export interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}

export interface PaymentsListProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  tenantId: string;
}