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

export interface TenantDisplay extends TenantFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  property_id?: string;
  profession?: string;
  lease?: {
    rent_amount: number;
    deposit_amount: number;
  };
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  contractId?: string;
}