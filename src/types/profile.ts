export type UserRole = 'user' | 'admin' | 'super_admin';

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
  password?: string;
}

export interface ProfileFormData {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: UserRole;
  agency_id?: string;
  is_tenant: boolean;
  status: string;
  has_seen_warning: boolean;
  password?: string;
  created_at?: string;
  updated_at?: string;
}