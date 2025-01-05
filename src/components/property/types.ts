export interface Property {
  id: string
  bien: string
  type: string
  chambres: number
  ville: string
  loyer: number
  frais_agence: number
  taux_commission: number
  caution: number
  statut: string
  photo_url: string | null
  user_id: string
  agency_id: string
  created_at: string
  updated_at: string
  owner_name?: string
  owner_phone?: string
  total_units: number
  property_category: string
  country?: string
  quartier?: string
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres: string
  ville: string
  loyer: string
  taux_commission: string
  caution: string
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}

export interface PropertyDialogProps {
  property?: Property | null
  onOpenChange?: (open: boolean) => void
  open?: boolean
  className?: string
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: (data: PropertyFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl?: string | string[]
}

// Apartment related interfaces
export interface Apartment {
  id: string
  name: string
  total_units: number
  city: string
  country: string
  owner_name: string | null
  owner_phone: string | null
  photo_url: string | null
  status: string
  agency_id: string | null
  created_by_user_id: string | null
  created_at: string
  updated_at: string
}

export interface ApartmentFormData {
  name: string
  city: string
  country: string
  total_units: string
  owner_name: string
  owner_phone: string
}

export interface ApartmentDialogProps {
  apartment?: Apartment | null
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export interface ApartmentFormFieldsProps {
  formData: ApartmentFormData
  setFormData: (data: ApartmentFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl?: string | string[]
}