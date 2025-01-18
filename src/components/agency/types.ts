export interface FormData {
  email: string
  password: string
  confirm_password: string
  agency_name: string
  agency_address: string
  agency_phone: string
  country: string
  city: string
  first_name: string
  last_name: string
}

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
  current_properties_count: number | null
  current_tenants_count: number | null
  current_profiles_count: number | null
  status: string
  country: string | null
  city: string | null
}