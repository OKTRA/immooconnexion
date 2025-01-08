export interface Administrator {
  id: string;
  is_super_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  agency_id?: string;
}

export type AdministratorInsert = Partial<Administrator>;
export type AdministratorUpdate = Partial<Administrator>;