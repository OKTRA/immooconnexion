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
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
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
  employer_name?: string;
  employer_phone?: string;
  employer_address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  additional_notes?: string;
  bank_name?: string;
  bank_account_number?: string;
  agency_fees?: number;
  profession?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount?: number;
  payment_frequency: string;
  duration_type: string;
  status: string;
  deposit_returned?: boolean;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
  payment_type?: string;
  initial_fees_paid?: boolean;
  initial_payments_completed?: boolean;
  tenant?: ApartmentTenant;
}

export interface ApartmentInspection {
  id: string;
  lease_id: string;
  inspection_date: string;
  has_damages?: boolean;
  damage_description?: string;
  repair_costs?: number;
  deposit_returned?: number;
  photo_urls?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_level?: string;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
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