export type ApartmentUnitStatus = "available" | "occupied" | "maintenance" | "reserved"
export type PaymentType = "upfront" | "monthly" | "quarterly" | "yearly"
export type PaymentFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
export type DurationType = "fixed" | "month_to_month" | "yearly"
export type LeaseStatus = "active" | "expired" | "terminated"

export interface Apartment {
  id: string
  agency_id: string
  name: string
  address?: string
  total_units: number
  description?: string
  created_at: string
  updated_at: string
}

export interface ApartmentUnit {
  id: string
  apartment_id: string
  unit_number: string
  floor_number?: number
  area?: number
  rent_amount: number
  deposit_amount?: number
  status: ApartmentUnitStatus
  description?: string
  created_at: string
  updated_at: string
  apartment?: Apartment
}

export interface ApartmentUnitFormData {
  unit_number: string
  floor_number?: number
  area?: number
  rent_amount: number
  deposit_amount?: number
  status: ApartmentUnitStatus
  description?: string
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
  created_at: string
  updated_at: string
  unit_id?: string
  employer_name?: string
  employer_phone?: string
  employer_address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  additional_notes?: string
  bank_name?: string
  bank_account_number?: string
  agency_fees?: number
  profession?: string
}

export interface LeaseFormData {
  tenant_id: string
  unit_id: string
  start_date: string
  end_date?: string
  rent_amount: number
  deposit_amount?: number
  payment_frequency: PaymentFrequency
  duration_type: DurationType
  status: LeaseStatus
  payment_type: PaymentType
  initial_fees_paid: boolean
  deposit_returned?: boolean
  deposit_return_date?: string
  deposit_return_amount?: number
  deposit_return_notes?: string
}