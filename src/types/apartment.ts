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
  depositReturnAmount: string;
  depositReturnDate: string;
  depositReturnNotes: string;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentType = 'upfront' | 'end_of_period';