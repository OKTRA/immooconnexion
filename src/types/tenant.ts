export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  profession?: string;
  property_id?: string;
  birth_date?: string;
  photo_id_url?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  profession?: string;
  property_id?: string;
}