export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: string;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  is_tenant: boolean;
  status: string;
  has_seen_warning: boolean;
}

export type ProfileInsert = Partial<Profile>;
export type ProfileUpdate = Partial<Profile>;