export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

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
  minimum_stay?: number | null;
  maximum_stay?: number | null;
  late_fee_percentage?: number | null;
  photo_urls?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
  rent_amount: string;
  deposit_amount: string;
  status: ApartmentUnitStatus;
  description: string;
  minimum_stay?: string;
  maximum_stay?: string;
  late_fee_percentage?: string;
}

export interface ApartmentUnitPricing {
  id: string;
  unit_id: string;
  duration_type: "hour" | "day" | "week" | "month" | "year";
  price: number;
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