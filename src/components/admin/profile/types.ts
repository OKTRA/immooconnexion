import { z } from "zod"

export interface ProfileFormData {
  id?: string
  email: string
  password: string
  first_name: string
  last_name: string
  role?: string
  agency_id?: string
  phone_number?: string
  status?: string
}

export interface ProfileFormProps {
  newProfile: ProfileFormData
  setNewProfile: (profile: ProfileFormData) => void
  onSuccess?: () => void
  isEditing?: boolean
  step?: 1 | 2
  setStep?: (step: 1 | 2) => void
  agencyId?: string
  onCreateAuthUser?: () => Promise<void>
  onUpdateProfile?: (email: string) => Promise<void>
  selectedAgencyId?: string
}