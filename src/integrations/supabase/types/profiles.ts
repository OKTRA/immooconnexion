export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: 'user' | 'admin' | 'super_admin' | null;
  agency_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_tenant: boolean | null;
  status: string | null;
  has_seen_warning: boolean | null;
}

export type ProfileInsert = Partial<Profile>;
export type ProfileUpdate = Partial<Profile>;