export type PropertyUnitStatus = "available" | "occupied" | "maintenance" | "reserved"

export interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  unit_name?: string
  floor_level?: string | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: PropertyUnitStatus
  description?: string | null
  living_rooms?: number
  bedrooms?: number
  bathrooms?: number
  kitchen_count?: number
  has_pool?: boolean
  created_at: string
  updated_at: string
}

export interface PropertyUnitFormData {
  id?: string
  property_id: string
  unit_number: string
  unit_name?: string
  floor_level?: string | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: PropertyUnitStatus
  description?: string | null
  living_rooms?: number
  bedrooms?: number
  bathrooms?: number
  kitchen_count?: number
  has_pool?: boolean
}