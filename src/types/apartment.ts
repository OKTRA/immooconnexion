export interface ApartmentUnit {
  id?: string
  apartment_id: string
  unit_number: string
  floor_number: number
  area: number
  rent_amount: number
  deposit_amount: number
  status: 'available' | 'occupied' | 'maintenance'
  description?: string
}

export interface ApartmentUnitFormData {
  unit_number: string
  floor_number: string
  area: string
  rent_amount: string
  deposit_amount: string
  status: 'available' | 'occupied' | 'maintenance'
  description?: string
}