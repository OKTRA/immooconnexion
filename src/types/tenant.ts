export interface TenantFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  birth_date?: string;
  profession?: string;
  agency_fees?: number;
  photo_id_url?: string;
  propertyId?: string;
  property_id?: string; // For backward compatibility
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isEndReceipt?: boolean;
  lease?: any;
  contractId?: string;
  isInitialReceipt?: boolean;
}

export interface TenantReceiptData {
  first_name: string;
  last_name: string;
  phone_number: string;
  agency_fees?: number;
  profession?: string;
  property_id?: string;
  nom?: string; // For backward compatibility
  prenom?: string; // For backward compatibility
}

export interface TenantDisplay {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_date?: string;
  photo_id_url?: string;
  agency_fees?: number;
  profession?: string;
}