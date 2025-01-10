export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type PaymentType = 'upfront' | 'end_of_period';

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount: number;
  status: ApartmentUnitStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
  photo_urls?: string[];
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount: number;
  status: ApartmentUnitStatus;
  description: string;
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

export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
  agency_id?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number?: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
}