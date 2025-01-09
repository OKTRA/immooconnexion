export type PropertyUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount?: number;
  status: PropertyUnitStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number: number;
  area: number;
  rent_amount: number;
  deposit_amount?: number;
  status: PropertyUnitStatus;
  description?: string;
}

export interface Property {
  id: string;
  bien: string;
  type: string;
  chambres?: number;
  ville?: string;
  loyer?: number;
  frais_agence?: number;
  taux_commission?: number;
  caution?: number;
  photo_url?: string;
  statut?: string;
  user_id?: string;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by_user_id?: string;
  parent_property_id?: string;
  rental_type?: string;
  property_category: 'house' | 'apartment';
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
}