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
  property_category: "house" | "apartment";
  is_for_sale?: boolean;
  sale_price?: number;
  minimum_stay?: number;
  maximum_stay?: number;
  price_per_night?: number;
  price_per_week?: number;
  total_units?: number;
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
}

export interface PropertyFormData {
  bien: string;
  type: string;
  chambres: string;
  ville: string;
  loyer: string;
  taux_commission: string;
  caution: string;
  frais_agence: string;
  property_category: "house" | "apartment";
  owner_name: string;
  owner_phone: string;
  country: string;
  quartier: string;
}