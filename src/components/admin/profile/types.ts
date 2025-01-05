import { UserRole } from "@/types/profile"

export interface Profile {
  id?: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  role: UserRole
  agency_id?: string
  created_at?: string
  updated_at?: string
  is_tenant?: boolean
  status?: string
  has_seen_warning?: boolean
  agency_name?: string
}

export interface ProfileFormProps {
  newProfile?: Profile
  setNewProfile?: React.Dispatch<React.SetStateAction<Profile>>
  onSuccess?: () => void
  isEditing?: boolean
  step?: 1 | 2
  setStep?: (step: 1 | 2) => void
  agencyId?: string
  handleSubmit?: (e: React.FormEvent) => Promise<void>
  selectedAgencyId?: string
  onUpdateProfile?: (userId: string) => Promise<void>
  onCreateAuthUser?: () => Promise<string>
  form?: any
}

export interface BasicInfoFieldsProps {
  newProfile?: Partial<Profile>
  onProfileChange: (profile: Partial<Profile>) => void
  isEditing?: boolean
  step?: 1 | 2
  selectedAgencyId?: string
  form?: any
}

export interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyId?: string
  onProfileCreated?: () => void
  newProfile?: Profile
  setNewProfile?: React.Dispatch<React.SetStateAction<Profile>>
  handleCreateAuthUser?: () => Promise<string>
  handleUpdateProfile?: (userId: string) => Promise<void>
}