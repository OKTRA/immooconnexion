export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Apartment {
  id: string;
  agency_id: string;
  name: string;
  address?: string;
  total_units?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string | null;
  commission_percentage?: number | null;
  created_at?: string;
  updated_at?: string;
  current_lease?: ApartmentLease;
  apartment?: {
    name: string;
  };
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: string;
  duration_type: string;
  status: string;
  payment_type: string;
  tenant?: ApartmentTenant;
  initial_fees_paid?: boolean;
}

export interface ApartmentTenant {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_id: string;
  unit_id?: string;
  agency_fees?: number;
  profession?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentInspection {
  id: string;
  lease_id: string;
  inspection_date: string;
  has_damages: boolean;
  damage_description: string | null;
  repair_costs: number;
  deposit_returned: number;
  photo_urls: string[];
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}