export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyUnitFormData {
  id?: string;
  property_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status?: string;
  description?: string;
}