export interface Administrator {
  id: string
  is_super_admin: boolean
  created_at?: string
  updated_at?: string
  agency_id?: string
}

export interface AdministratorInsert extends Omit<Administrator, 'id'> {}
export interface AdministratorUpdate extends Partial<Administrator> {}