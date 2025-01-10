export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type PaymentType = 'upfront' | 'end_of_period';

export interface Apartment {
  id: string;
  name: string;
  address?: string;
  total_units: number;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
}

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
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
  photo_urls?: string[];
}

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  paymentFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  durationType: 'fixed' | 'month_to_month' | 'yearly';
  status: 'active' | 'expired' | 'terminated';
  paymentType: PaymentType;
  depositReturned?: boolean;
  depositReturnDate?: string;
  depositReturnAmount?: string;
  depositReturnNotes?: string;
}