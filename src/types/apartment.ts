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
  created_at?: string;
  updated_at?: string;
}

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

export interface ApartmentTenantDisplay extends ApartmentTenant {
  apartment_unit?: {
    unit_number: string;
    apartment?: {
      name: string;
    };
  };
}

export interface Apartment {
  id: string;
  name: string;
  address: string | null;
  total_units: number;
  description: string | null;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
}