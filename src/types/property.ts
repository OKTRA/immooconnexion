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
  property_category: 'house' | 'duplex' | 'triplex';
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
  owner_id?: string;
  living_rooms?: number;
  bathrooms?: number;
  store_count?: number;
  has_pool?: boolean;
  kitchen_count?: number;
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
  bathrooms?: number;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  description?: string;
  bathrooms?: number;
}