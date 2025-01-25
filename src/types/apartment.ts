export interface ApartmentUnitFormData {
  unit_number: string;
  unit_name?: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: string;
  description?: string;
  commission_percentage?: number;
  store_count?: number;
  kitchen_count?: number;
  has_pool?: boolean;
  living_rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ApartmentTenantFormProps {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  initialData?: ApartmentTenant;
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
  agency_fees?: number;
  profession?: string;
  created_at?: string;
  updated_at?: string;
  apartment_leases?: ApartmentLease[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  unit_id?: string;
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: string;
  duration_type: string;
  status: string;
  payment_type: string;
  tenant: ApartmentTenant;
}