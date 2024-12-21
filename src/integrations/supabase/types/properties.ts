export type Property = {
  id: string
  bien: string
  type: string
  chambres: number | null
  ville: string | null
  loyer: number | null
  frais_agence: number | null
  taux_commission: number | null
  caution: number | null
  photo_url: string | null
  statut: string | null
  user_id: string | null
  created_at: string
  updated_at: string
}

export type PropertyInsert = {
  id?: string
  bien: string
  type: string
  chambres?: number | null
  ville?: string | null
  loyer?: number | null
  frais_agence?: number | null
  taux_commission?: number | null
  caution?: number | null
  photo_url?: string | null
  statut?: string | null
  user_id?: string | null
  created_at?: string
  updated_at?: string
}

export type PropertyUpdate = {
  id?: string
  bien?: string
  type?: string
  chambres?: number | null
  ville?: string | null
  loyer?: number | null
  frais_agence?: number | null
  taux_commission?: number | null
  caution?: number | null
  photo_url?: string | null
  statut?: string | null
  user_id?: string | null
  created_at?: string
  updated_at?: string
}