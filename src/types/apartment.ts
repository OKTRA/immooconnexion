export interface Apartment {
  id: string;
  agency_id: string;
  name: string;
  address?: string;
  total_units?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  country?: string;
  city?: string;
  neighborhood?: string;
}

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_level?: string;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: ApartmentUnitStatus;
  description?: string;
  created_at: string;
  updated_at: string;
  commission_percentage?: number;
  unit_name?: string;
  living_rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  store_count?: number;
  has_pool?: boolean;
  kitchen_count?: number;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_level?: string;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: ApartmentUnitStatus;
  description?: string;
  commission_percentage?: number;
  unit_name?: string;
  living_rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  store_count?: number;
  has_pool?: boolean;
  kitchen_count?: number;
}

export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';