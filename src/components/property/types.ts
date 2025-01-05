export interface Property {
  id: string
  bien: string
  type: string
  chambres: number
  ville: string
  loyer: number
  frais_agence: number
  taux_commission: number
  caution: number
  statut: string
  photo_url: string | null
  user_id: string
  agency_id: string
  created_at: string
  updated_at: string
  owner_name?: string
  owner_phone?: string
  total_units: number
  property_category: string
  country?: string
  quartier?: string
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres: string
  ville: string
  loyer: string
  taux_commission: string
  caution: string
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}
