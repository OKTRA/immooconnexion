import { Dispatch, SetStateAction } from "react"

export interface PropertyFormData {
  id?: string
  title: string
  description: string
  price: number
  location: string
  images: string[]
  type: 'apartment' | 'house'
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl: string[]
  propertyType?: 'apartment' | 'house'
}

export interface PropertyDialogProps {
  property?: PropertyFormData
  onOpenChange?: (open: boolean) => void
  open?: boolean
}
