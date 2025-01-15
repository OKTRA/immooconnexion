export interface LeaseData {
  id: string;
  rent_amount: number;
  tenant_id: string;
  unit_id: string;
  payment_frequency: string;
  deposit_amount: number;
  initial_payments_completed: boolean;
  apartment_tenants: {
    first_name: string | null;
    last_name: string | null;
  };
  apartment_units: {
    unit_number: string | null;
    apartment: {
      name: string | null;
    };
  };
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}