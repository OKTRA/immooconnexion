export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_fees?: number;
  profession?: string;
  property_id?: string;
  agency_id?: string;
}

export interface TenantDisplay extends TenantFormData {
  created_at?: string;
  updated_at?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  contractId?: string;
}