export interface Profile {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  agency_id: string;
  created_at: string;
  updated_at: string;
  is_tenant: boolean;
  status: string;
  has_seen_warning: boolean;
}

export interface ProfileFormProps {
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  onSuccess?: () => void;
  isEditing?: boolean;
  onCreateAuthUser?: () => Promise<void>;
  onUpdateProfile?: (userId: string) => Promise<void>;
  selectedAgencyId?: string;
}