export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}

export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export type PaymentType = 'upfront' | 'end_of_period';

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string;
  photo_urls?: string[];
}

export interface Apartment {
  id: string;
  agency_id: string;
  name: string;
  address?: string;
  total_units?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
  agency_fees?: number;
  profession?: string;
  created_at: string;
  updated_at: string;
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

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';