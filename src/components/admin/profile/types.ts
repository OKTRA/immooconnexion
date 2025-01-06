import { UserRole } from "@/types/profile"

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: UserRole;
  agency_id: string;
  created_at: string;
  updated_at: string;
  is_tenant: boolean;
  status: string;
  has_seen_warning: boolean;
  agency_name?: string;
  password?: string;
}

export interface ProfileFormProps {
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  onSuccess?: () => Promise<void>;
  isEditing?: boolean;
  onCreateAuthUser?: () => Promise<void>;
  onUpdateProfile?: (userId: string) => Promise<void>;
  selectedAgencyId?: string;
}