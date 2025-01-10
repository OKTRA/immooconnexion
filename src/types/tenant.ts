export interface TenantFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_fees?: number;
  profession?: string;
  property_id?: string;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  property_id?: string;
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isEndReceipt?: boolean;
  lease?: {
    rent_amount: number;
    deposit_amount: number;
  };
}