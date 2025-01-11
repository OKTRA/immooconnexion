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
  commission_percentage: number;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
  rent_amount: string;
  deposit_amount: string;
  status: ApartmentUnitStatus;
  description: string;
  commission_percentage: string;
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
  agency_id: string;
  created_at?: string;
  updated_at?: string;
  deposit_returned?: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
  initial_fees_paid?: boolean;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentType = 'upfront' | 'end_of_period';