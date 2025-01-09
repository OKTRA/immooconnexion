export interface TenantFormData {
  first_name: string;
  last_name: string;
  birth_date?: string;
  phone_number: string;
  photo_id_url?: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
  email?: string;
}

export interface TenantDisplay {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  photo_id_url?: string;
  agency_fees?: string;
  user_id?: string;
  profession?: string;
}