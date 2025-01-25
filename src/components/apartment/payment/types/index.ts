export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';

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
  isLoading: boolean;
}

export interface PeriodOption {
  value: number;
  label: string;
}

export interface PaymentFormProps {
  onSuccess: () => void;
  leaseId: string;
  tenantId?: string;
  paymentType?: 'deposit' | 'agency_fees' | 'rent';
}