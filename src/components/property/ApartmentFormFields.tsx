import { Separator } from "@/components/ui/separator"
import { BasicInfoSection } from "../apartment/form-sections/BasicInfoSection"
import { OwnerInfoSection } from "../apartment/form-sections/OwnerInfoSection"
import { PhotoUploadSection } from "../apartment/form-sections/PhotoUploadSection"
import { ApartmentFormFieldsProps } from "./types"

export function ApartmentFormFields({ 
  formData, 
  setFormData, 
  handleImageChange,
  imagePreviewUrl 
}: ApartmentFormFieldsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="grid gap-6 py-4">
      <BasicInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />

      <Separator />

      <OwnerInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <Separator />

      <PhotoUploadSection 
        handleImageChange={handleImageChange}
        previewUrls={Array.isArray(imagePreviewUrl) ? imagePreviewUrl : imagePreviewUrl ? [imagePreviewUrl] : []}
      />
    </div>
  )
}