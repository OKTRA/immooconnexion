export type UserRole = 'user' | 'admin' | 'super_admin';

export interface Profile {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  is_tenant?: boolean;
  status?: string;
}

export interface ProfileFormProps {
  isEditing?: boolean;
  step?: 1 | 2;
  setStep?: (step: 1 | 2) => void;
  selectedAgencyId?: string;
  agencyId?: string;
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  onCreateAuthUser?: () => Promise<string>;
  onUpdateProfile?: (userId: string) => Promise<void>;
}

export interface AddProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  handleCreateAuthUser: () => Promise<string>;
  handleUpdateProfile: (userId: string) => Promise<void>;
  agencyId?: string;
  onProfileCreated?: () => void;
}