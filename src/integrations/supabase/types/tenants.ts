export interface Tenant {
  id: string;
  nom: string;
  prenom: string;
  birth_date: string | null;
  phone_number: string | null;
  photo_id_url: string | null;
  agency_fees: number | null;
  user_id: string | null;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  profession: string | null;
  created_by_user_id: string | null;
}

export type TenantInsert = Partial<Tenant>;
export type TenantUpdate = Partial<Tenant>;