export interface PropertyDialogProps {
  property?: any
  onOpenChange?: (open: boolean) => void
  open?: boolean
  type?: 'apartment' | 'house'
}

export interface PropertyFormFieldsProps {
  formData: any
  setFormData: (data: any) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviewUrl: string[]
  propertyType?: 'apartment' | 'house'
}
