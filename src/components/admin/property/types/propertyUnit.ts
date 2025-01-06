export interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  floor_number: number
  area?: number
  rent: number
  deposit: number
  status: string
  description?: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface PropertyUnitFormData {
  unit_number: string
  floor_number: number
  area?: number
  rent: number
  deposit: number
  status?: string
  description?: string
}