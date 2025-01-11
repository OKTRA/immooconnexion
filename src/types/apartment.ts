export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number | null;
  area: number | null;
  rent_amount: number;
  deposit_amount: number | null;
  status: ApartmentUnitStatus;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
  rent_amount: string;
  deposit_amount: string;
  status: ApartmentUnitStatus;
  description: string;
}

export interface ApartmentContract {
  id: string;
  montant: number;
  type: 'location';
  rent_amount: number;
  deposit_amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface ApartmentTenantReceipt {
  tenant: {
    first_name: string;
    last_name: string;
    phone_number: string;
    agency_fees?: number;
  };
  isEndReceipt?: boolean;
  lease?: ApartmentContract;
}

export interface ApartmentInspectionProps {
  lease: ApartmentContract;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  status: LeaseStatus;
  payment_type: PaymentType;
  deposit_returned: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: string;
  deposit_return_notes?: string;
  agency_id: string;
  created_at: string;
  updated_at: string;
  initial_fees_paid: boolean;
}

export interface ApartmentInspection {
  id: string;
  lease_id: string;
  inspection_date: string;
  has_damages: boolean;
  damage_description?: string;
  repair_costs: number;
  deposit_returned: number;
  photo_urls: string[];
  status: 'pending' | 'completed';
  type?: 'initial' | 'final';
  created_at: string;
  updated_at: string;
}

export interface ApartmentLeasePayment {
  id: string;
  lease_id: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid';
  late_fee_amount?: number;
  payment_method: 'cash' | 'bank_transfer' | 'check';
  agency_id: string;
  created_at: string;
  updated_at: string;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentType = 'upfront' | 'end_of_period';