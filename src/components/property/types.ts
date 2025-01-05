import { ChangeEvent } from "react"

export interface PropertyFormData {
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
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl: string[]
  propertyType?: "apartment" | "house"
}
