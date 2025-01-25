export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';
export type PaymentType = 'deposit' | 'agency_fees' | 'rent';

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
}

export interface PaymentFormProps {
  onSuccess: () => void;
  leaseId: string;
  tenantId?: string;
  paymentType?: PaymentType;
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