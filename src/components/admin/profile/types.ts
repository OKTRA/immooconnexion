import { Profile } from "@/types/profile"

export interface ProfileFormProps {
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
  onSuccess?: () => Promise<void>
  isEditing?: boolean
  onCreateAuthUser?: () => Promise<void>
  onUpdateProfile?: (userId: string) => Promise<void>
  selectedAgencyId?: string
}