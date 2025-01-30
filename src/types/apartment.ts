import { PaymentMethod } from "./payment"

export interface Apartment {
  id: string
  agency_id: string
  name: string
  address?: string
  total_units?: number
  description?: string
  owner_id?: string
  country?: string
  city?: string
  neighborhood?: string
}

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
  status: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
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
  agency_id: string
  tenant: ApartmentTenant
  unit?: {
    id: string
    unit_number: string
    apartment?: {
      id: string
      name: string
    }
  }
  initial_fees_paid?: boolean
  initial_payments_completed?: boolean
}

export interface ApartmentInspection {
  id: string
  lease_id: string
  inspection_date: string
  has_damages: boolean
  damage_description?: string
  repair_costs: number
  deposit_returned: number
  photo_urls: string[]
  status: string
}

export interface ApartmentUnitFormData {
  unit_number: string
  floor_number?: number | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: string
  description?: string | null
  commission_percentage?: number | null
  unit_name?: string | null
  floor_level?: string | null
  living_rooms?: number
  bedrooms?: number
  bathrooms?: number
  store_count?: number
  has_pool?: boolean
  kitchen_count?: number
}

export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved'