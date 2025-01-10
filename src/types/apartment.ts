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
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount: number;
  status: ApartmentUnitStatus;
  description?: string;
}

export interface Apartment {
  id: string;
  name: string;
  address: string;
  total_units: number;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentTenant {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_id: string;
  unit_id?: string;
  created_at?: string;
  updated_at?: string;
  employer_name?: string;
  employer_phone?: string;
  employer_address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  additional_notes?: string;
  bank_name?: string;
  bank_account_number?: string;
  agency_fees?: number;
  profession?: string;
}

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  paymentFrequency: PaymentFrequency;
  durationType: DurationType;
  status: LeaseStatus;
  paymentType: PaymentType;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentType = 'upfront' | 'end_of_period';