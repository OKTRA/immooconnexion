export type PropertyUnitStatus = "available" | "occupied" | "maintenance" | "reserved"

export interface PropertyUnitFormData {
  id?: string;
  property_id: string;
  unit_number: string;
  floor_level?: string | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: PropertyUnitStatus;
  description?: string | null;
  living_rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  store_count?: number;
  kitchen_description?: string | null;
  has_pool?: boolean;
  unit_name?: string | null;
}

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_level?: string | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: PropertyUnitStatus;
  description?: string | null;
  created_at: string;
  updated_at: string;
}