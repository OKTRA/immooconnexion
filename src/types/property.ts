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
}

export interface PropertyOwner {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  description?: string;
}