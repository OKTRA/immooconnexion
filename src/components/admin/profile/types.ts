import { UserRole } from "@/types/profile"
import { Dispatch, SetStateAction } from "react"
import { UseFormReturn } from "react-hook-form"

export interface Profile {
  id?: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  role: UserRole
}

export interface ProfileFormProps {
  newProfile?: Profile
  setNewProfile?: Dispatch<SetStateAction<Profile>>
  onSuccess?: () => void
  isEditing?: boolean
  step?: 1 | 2
  setStep?: (step: 1 | 2) => void
  agencyId?: string
  handleSubmit?: (e: React.FormEvent) => Promise<void>
  selectedAgencyId?: string
  onUpdateProfile?: (userId: string) => Promise<void>
  onCreateAuthUser?: () => Promise<string>
  form?: UseFormReturn<Profile>
}

export interface BasicInfoFieldsProps {
  newProfile?: Partial<Profile>
  onProfileChange: (profile: Partial<Profile>) => void
  isEditing?: boolean
  step?: 1 | 2
  selectedAgencyId?: string
  form?: UseFormReturn<Profile>
}

export interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencyId?: string
  onProfileCreated?: () => void
  newProfile?: Profile
  setNewProfile?: Dispatch<SetStateAction<Profile>>
  handleCreateAuthUser?: () => Promise<string>
  handleUpdateProfile?: (userId: string) => Promise<void>
}