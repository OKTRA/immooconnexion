import { Database } from "@/integrations/supabase/types/database.types"

export type Property = Database["public"]["Tables"]["properties"]["Row"] & {
  property_category: "house" | "duplex" | "triplex"
}

export interface PropertyDialogProps {
  property?: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: (data: PropertyFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl?: string | string[]
  propertyType?: "apartment" | "house"
  owners?: Array<{
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }>
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
  property_category: "house" | "duplex" | "triplex"
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
  owner_id?: string
}