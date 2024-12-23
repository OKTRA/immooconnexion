export interface Agency {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  subscription_plan_id?: string
  show_phone_on_site?: boolean
  list_properties_on_site?: boolean
  created_at: string
  updated_at: string
}