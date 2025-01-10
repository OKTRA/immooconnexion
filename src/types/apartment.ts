export type ApartmentUnitStatus = "available" | "occupied" | "maintenance" | "reserved"
export type PaymentType = "upfront" | "end_of_period"
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
  photo_urls?: string[]
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
  photo_urls?: string[]
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
  depositReturned?: boolean
  depositReturnDate?: string
  depositReturnAmount?: number
  depositReturnNotes?: string
}