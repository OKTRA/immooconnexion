export interface ApartmentTenant {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  birth_date?: string
  photo_id_url?: string
  agency_id: string
  agency_fees?: number
  profession?: string
  created_at?: string
  updated_at?: string
  status: string
}

export interface ApartmentLease {
  id: string
  tenant_id: string
  unit_id: string
  start_date: string
  end_date?: string
  rent_amount: number
  deposit_amount: number
  payment_frequency: string
  duration_type: string
  status: string
  payment_type: string
  tenant: ApartmentTenant
  agency_id: string
  unit?: {
    id: string
    unit_number: string
    apartment?: {
      id: string
      name: string
    }
  }
}

export interface ApartmentUnit {
  id: string
  apartment_id: string
  unit_number: string
  floor_number?: number
  area?: number
  rent_amount: number
  deposit_amount?: number
  status: string
  description?: string
  commission_percentage?: number
  unit_name?: string
  floor_level?: string
  living_rooms?: number
  bedrooms?: number
  bathrooms?: number
  store_count?: number
  has_pool?: boolean
  kitchen_count?: number
  apartment?: {
    name: string
    address?: string
  }
}

export interface LeaseFormData {
  tenant_id: string
  unit_id: string
  start_date: string
  end_date?: string
  rent_amount: number
  deposit_amount: number
  payment_frequency: string
  duration_type: string
  payment_type: string
  status: string
}

export interface CreateLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId?: string
}

export interface ApartmentTenantFormProps {
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: ApartmentTenant
  unitId?: string
}