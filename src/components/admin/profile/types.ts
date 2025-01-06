import { Profile } from "@/types/profile"

export interface ProfileFormProps {
  newProfile: Profile;
  setNewProfile: (profile: Profile) => void;
  onSuccess?: () => void;
  isEditing?: boolean;
  onCreateAuthUser?: () => Promise<void>;
  onUpdateProfile?: (userId: string) => Promise<void>;
  selectedAgencyId?: string;
  onSubmit?: () => Promise<void>;
  onUpdate?: (userId: string) => Promise<void>;
}