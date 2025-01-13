export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

export interface ApartmentInspection {
  id: string;
  lease_id: string;
  inspection_date: string;
  has_damages: boolean;
  damage_description: string | null;
  repair_costs: number;
  deposit_returned: number;
  photo_urls: string[];
  status: string;
  type?: string;
  created_at: string;
  updated_at: string;
}

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number | null;
  area: number | null;
  rent_amount: number;
  deposit_amount: number | null;
  status: ApartmentUnitStatus;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  commission_percentage: number | null;
  current_lease?: {
    tenant: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      birth_date: string;
      profession: string;
    };
    id: string;
    start_date: string;
    end_date: string;
    rent_amount: number;
    deposit_amount: number;
    status: string;
  };
  apartment?: {
    name: string;
  };
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  status: LeaseStatus;
  payment_type: PaymentType;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
  deposit_returned?: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
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
  unit_id?: string;
  agency_fees?: number;
  profession?: string;
  created_at?: string;
  updated_at?: string;
  additional_notes?: string;
  bank_name?: string;
  bank_account_number?: string;
  employer_name?: string;
  employer_phone?: string;
  employer_address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  apartment_units?: {
    unit_number: string;
    apartment: {
      name: string;
    };
  };
  apartment_leases?: ApartmentLease[];
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentType = 'upfront' | 'end_of_period';

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

export interface Property {
  id: string;
  bien: string;
  type: string;
  chambres: number;
  ville: string;
  loyer: number;
  frais_agence: number;
  taux_commission: number;
  caution: number;
  photo_url?: string;
  statut: string;
  user_id: string;
  agency_id: string;
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
  parent_property_id?: string;
  rental_type?: string;
  property_category: "house" | "apartment";
  is_for_sale?: boolean;
  sale_price?: number;
  minimum_stay?: number;
  maximum_stay?: number;
  price_per_night?: number;
  price_per_week?: number;
  total_units?: number;
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
}