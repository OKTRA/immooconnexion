export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  phone_number: string;
  email?: string;
  photo_id_url?: string;
  agency_fees?: number;
  property_id?: string;
  agency_id?: string;
  profession?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  property_id?: string;
}

export interface TenantDisplay extends TenantFormData {
  id: string;
  created_at?: string;
  updated_at?: string;
}