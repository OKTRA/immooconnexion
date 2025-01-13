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
}

export type ApartmentUnitStatus = "available" | "occupied" | "maintenance" | "reserved"

export interface ApartmentUnit {
  id: string
  apartment_id: string
  unit_number: string
  floor_number?: number | null
  area?: number | null
  rent_amount: number
  deposit_amount?: number | null
  status: ApartmentUnitStatus
  description?: string | null
  created_at?: string
  updated_at?: string
  commission_percentage?: number | null
  current_lease?: {
    tenant: {
      id: string
      first_name: string
      last_name: string
      email: string
      phone_number: string
      birth_date: string
      profession: string
    }
    id: string
    start_date: string
    end_date: string
    rent_amount: number
    deposit_amount: number
    status: string
  }
  apartment?: {
    name: string
  }
}