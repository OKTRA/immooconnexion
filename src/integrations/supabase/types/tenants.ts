export type Tenant = {
  id: string
  birth_date: string | null
  phone_number: string | null
  photo_id_url: string | null
  agency_fees: number | null
  created_at: string
  updated_at: string
}

export type TenantInsert = {
  id: string
  birth_date?: string | null
  phone_number?: string | null
  photo_id_url?: string | null
  agency_fees?: number | null
  created_at?: string
  updated_at?: string
}

export type TenantUpdate = {
  id?: string
  birth_date?: string | null
  phone_number?: string | null
  photo_id_url?: string | null
  agency_fees?: number | null
  created_at?: string
  updated_at?: string
}