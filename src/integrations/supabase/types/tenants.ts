export interface Tenant {
  id: string;
  nom: string;
  prenom: string;
  birth_date?: string;
  phone_number?: string;
  photo_id_url?: string;
  agency_fees?: number;
  user_id?: string;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  profession?: string;
  created_by_user_id?: string;
}

export type TenantInsert = Partial<Tenant>;
export type TenantUpdate = Partial<Tenant>;