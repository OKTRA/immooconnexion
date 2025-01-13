import { Property as SupabaseProperty } from "@/integrations/supabase/types/properties"

export interface Property extends Omit<SupabaseProperty, 'property_category'> {
  property_category: 'house' | 'duplex' | 'triplex' | 'apartment'
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres?: number
  ville?: string
  loyer?: number
  frais_agence?: number
  taux_commission?: number
  caution?: number
  photo_url?: string
  statut?: string
  property_category: 'house' | 'duplex' | 'triplex' | 'apartment'
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}

export interface PropertyDialogProps {
  property?: Property | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}