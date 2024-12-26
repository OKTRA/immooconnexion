import { UserRole } from "@/types/profile"

export interface ProfileFormData {
  id?: string
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  role?: UserRole
  agency_id?: string
  phone_number?: string
}