export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: ApartmentUnitStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Apartment {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  total_units: number;
  agency_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: ApartmentUnitStatus;
  description?: string;
}