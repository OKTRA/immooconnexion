export interface Profile {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  role?: string
  agency_id?: string
  created_at?: string
  updated_at?: string
  is_tenant?: boolean
  status?: string
  has_seen_warning?: boolean
}

export interface ProfileInsert extends Omit<Profile, 'id'> {}
export interface ProfileUpdate extends Partial<Profile> {}