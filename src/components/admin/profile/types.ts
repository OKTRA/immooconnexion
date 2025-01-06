import { Profile } from "@/types/profile"

export interface ProfileFormProps {
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
  onSuccess?: () => Promise<void>
  isEditing?: boolean
  onCreateAuthUser?: () => Promise<void>
  onUpdateProfile?: (userId: string) => Promise<void>
  selectedAgencyId?: string
  onSubmit?: () => Promise<void>
  onUpdate?: (userId: string) => Promise<void>
}

export interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
  handleCreateAuthUser: () => Promise<void>
  handleUpdateProfile: (userId: string) => Promise<void>
  agencyId?: string
  onProfileCreated?: () => Promise<void>
}