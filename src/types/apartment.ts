export type ApartmentUnitStatus = "available" | "occupied" | "maintenance" | "reserved"
export type PaymentType = "upfront" | "monthly" | "quarterly" | "yearly"
export type PaymentFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
export type DurationType = "fixed" | "month_to_month" | "yearly"
export type LeaseStatus = "active" | "expired" | "terminated"

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
  payment_type: "upfront"
  initial_fees_paid: boolean
  deposit_returned?: boolean
  deposit_return_date?: string
  deposit_return_amount?: number
  deposit_return_notes?: string
}