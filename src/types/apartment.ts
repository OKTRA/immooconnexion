export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: ApartmentUnitStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
  current_lease?: ApartmentLease;
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
  payment_type?: string;
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
  created_at?: string;
  updated_at?: string;
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
  apartment_leases?: ApartmentLease[];
}

export interface ApartmentInspection {
  id: string;
  lease_id: string;
  inspection_date: string;
  has_damages: boolean;
  damage_description?: string;
  repair_costs: number;
  deposit_returned: number;
  photo_urls: string[];
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}