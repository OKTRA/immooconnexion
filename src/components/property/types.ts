import { Property as SupabaseProperty } from "@/integrations/supabase/types/properties"

export type Property = Omit<SupabaseProperty, 'user_id'> & {
  user_id: string | null // Changed from optional to required to match Supabase type
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres: string
  ville: string
  loyer: string
  taux_commission: string
  caution: string
  frais_agence: string
  property_category: "house" | "apartment"
  owner_name: string
  owner_phone: string
  country: string
  quartier: string
}

export interface PropertyDialogProps {
  property?: Property | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}