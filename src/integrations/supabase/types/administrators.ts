export type Administrator = {
  id: string
  full_name: string
  phone_number: string | null
  is_super_admin: boolean | null
  created_at: string
  updated_at: string
}

export type AdministratorInsert = {
  id: string
  full_name: string
  phone_number?: string | null
  is_super_admin?: boolean | null
  created_at?: string
  updated_at?: string
}

export type AdministratorUpdate = {
  id?: string
  full_name?: string
  phone_number?: string | null
  is_super_admin?: boolean | null
  created_at?: string
  updated_at?: string
}