import { Database } from "@/integrations/supabase/types"

export interface Agency {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  subscription_plan_id: string | null
  show_phone_on_site: boolean | null
  list_properties_on_site: boolean | null
  created_at: string | null
  updated_at: string | null
  logo_url: string | null
  current_properties_count?: number
  current_tenants_count?: number
  current_profiles_count?: number
  status: 'active' | 'pending' | 'blocked'
  country: string | null
  city: string | null
}

export interface AgencyUser {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: 'admin' | 'user'
  agency_id: string
  phone_number?: string | null
}

export interface AgencyUserActionsProps {
  userId: string
  onEditAuth?: () => void
  refetch: () => void
}

export interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  agencyId: string
  onSuccess: () => void
}