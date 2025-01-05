import { z } from "zod"

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface Profile {
  id?: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: UserRole;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  is_tenant?: boolean;
  status?: string;
  has_seen_warning?: boolean;
  agency_name?: string;
}

export interface ProfileFormProps {
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  onSuccess?: () => void;
  isEditing?: boolean;
  step?: 1 | 2;
  setStep?: (step: 1 | 2) => void;
  selectedAgencyId?: string;
  onCreateAuthUser?: () => Promise<string>;
  onUpdateProfile?: (userId: string) => Promise<void>;
}

export interface AddProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  handleCreateAuthUser: () => Promise<string>;
  handleUpdateProfile: () => Promise<void>;
}