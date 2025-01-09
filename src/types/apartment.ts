export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

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
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount: number;
  status: ApartmentUnitStatus;
  description: string;
}

export type PaymentType = "upfront" | "end_of_period";