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

export interface LeaseFormData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  paymentFrequency: PaymentFrequency;
  durationType: DurationType;
  status: LeaseStatus;
  paymentType: PaymentType;
  depositReturned: boolean;
  depositReturnDate?: string;
  depositReturnAmount?: string;
  depositReturnNotes?: string;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';