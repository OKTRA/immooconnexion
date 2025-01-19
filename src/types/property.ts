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
  property_category: 'house' | 'duplex' | 'triplex' | 'apartment';
  owner_id?: string;
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
  parent_property_id?: string;
  rental_type?: string;
  is_for_sale?: boolean;
  sale_price?: number;
  minimum_stay?: number;
  maximum_stay?: number;
  price_per_night?: number;
  price_per_week?: number;
  total_units?: number;
}

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_level?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_level?: number;
  area?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  description?: string;
}