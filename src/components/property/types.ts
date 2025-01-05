import { ChangeEvent } from "react"

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
  photo_url?: string
  statut?: string
  property_category: "house" | "apartment"
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}

export interface PropertyFormData {
  bien: string
  type: string
  chambres: string
  ville: string
  loyer: string
  frais_agence: string
  taux_commission: string
  caution: string
  photo_url?: string
  statut?: string
  property_category: "house" | "apartment"
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}

export interface PropertyDialogProps {
  property?: Property | null
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl: string[]
  propertyType?: "apartment" | "house"
}