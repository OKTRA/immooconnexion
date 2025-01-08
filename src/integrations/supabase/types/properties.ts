export interface Property {
  id: string;
  bien: string;
  type: string;
  chambres: number | null;
  ville: string | null;
  loyer: number | null;
  frais_agence: number | null;
  taux_commission: number | null;
  caution: number | null;
  photo_url: string | null;
  statut: string;
  user_id: string | null;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  created_by_user_id: string | null;
  parent_property_id: string | null;
  rental_type: string;
  property_category: string;
  is_for_sale: boolean;
  sale_price: number | null;
  minimum_stay: number;
  maximum_stay: number | null;
  price_per_night: number | null;
  price_per_week: number | null;
  total_units: number;
  owner_name: string | null;
  owner_phone: string | null;
  country: string | null;
  quartier: string | null;
}

export interface PropertyInsert extends Omit<Property, 'id' | 'created_at' | 'updated_at'> {}
export interface PropertyUpdate extends Partial<PropertyInsert> {}