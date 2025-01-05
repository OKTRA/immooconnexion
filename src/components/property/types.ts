export interface PropertyDialogProps {
  property?: Property
  onOpenChange?: (open: boolean) => void
  open?: boolean
  type?: 'apartment' | 'house'
}

export interface Property {
  id?: string
  bien: string
  type: string
  chambres?: number
  ville: string
  loyer: number
  taux_commission: number
  caution: number
  photo_url?: string
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
  agency_id?: string
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres: string
  ville: string
  loyer: string
  taux_commission: string
  caution: string
  owner_name: string
  owner_phone: string
  country?: string
  quartier?: string
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: (data: PropertyFormData) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl: string[]
  propertyType?: 'apartment' | 'house'
}