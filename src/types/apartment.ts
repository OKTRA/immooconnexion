export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type PaymentType = 'upfront' | 'end_of_period';

export interface Apartment {
  id: string;
  agency_id: string;
  name: string;
  address?: string;
  total_units: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  photo_urls?: string[];
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string | null;
}

export interface LeaseFormData {
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: string;
  duration_type: string;
  payment_type: PaymentType;
  initial_fees_paid: boolean;
  deposit_returned?: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
}

export interface ApartmentTenant {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_id: string;
  unit_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number?: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isEndReceipt?: boolean;
  isInitialReceipt?: boolean;
  contractId?: string;
  lease?: {
    rent_amount: number;
    deposit_amount: number;
  };
}