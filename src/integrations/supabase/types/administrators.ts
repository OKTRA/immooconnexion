export interface Administrator {
  id: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  agency_id: string | null;
}

export interface AdministratorInsert extends Omit<Administrator, 'id' | 'created_at' | 'updated_at'> {}
export interface AdministratorUpdate extends Partial<AdministratorInsert> {}