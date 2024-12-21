export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export type ProfileInsert = {
  id: string
  first_name?: string | null
  last_name?: string | null
  created_at?: string
  updated_at?: string
}

export type ProfileUpdate = {
  id?: string
  first_name?: string | null
  last_name?: string | null
  created_at?: string
  updated_at?: string
}