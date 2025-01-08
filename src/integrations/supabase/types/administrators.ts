export interface Administrator {
  id: string;
  is_super_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  agency_id: string | null;
}

export type AdministratorInsert = Partial<Administrator>;
export type AdministratorUpdate = Partial<Administrator>;