export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount: number;
  status: ApartmentUnitStatus;
  description: string;
  created_at: string;
  updated_at: string;
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

export type PaymentType = 'upfront' | 'monthly' | 'quarterly' | 'yearly';

export interface ApartmentTenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  birth_date: string | null;
  photo_id_url: string | null;
  agency_id: string;
  unit_id: string | null;
  created_at?: string;
  updated_at?: string;
}