export interface ApartmentTenant {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  photo_id_url?: string;
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
  agency_id: string;
  unit_id?: string;
  created_at?: string;
  updated_at?: string;
}