export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  phone_number: string;
  photo_id_url?: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
}