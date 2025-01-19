export type PropertyUnitStatus = "available" | "occupied" | "maintenance" | "reserved"

export interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  floor_number?: number | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: PropertyUnitStatus
  description?: string | null
  created_at: string
  updated_at: string
}

export interface PropertyUnitFormData {
  id?: string
  property_id: string
  unit_number: string
  floor_number?: number | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: PropertyUnitStatus
  description?: string | null
}