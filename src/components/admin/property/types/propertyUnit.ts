export type PropertyUnitStatus = 'available' | 'occupied' | 'maintenance';

export interface PropertyUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: PropertyUnitStatus;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type PropertyUnitFormData = Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>;