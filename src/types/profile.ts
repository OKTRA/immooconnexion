export type UserRole = 'user' | 'admin' | 'blocked' | 'super_admin';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: UserRole;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  is_tenant: boolean;
  status: string;
  has_seen_warning: boolean;
  agency_name?: string;
}

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<ProfileInsert>;