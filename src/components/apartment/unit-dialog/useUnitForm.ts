import { useState } from "react"
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSubmit?: (data: ApartmentUnit) => Promise<void>
) {
  const [formData, setFormData] = useState<ApartmentUnitFormData>({
    unit_number: initialData?.unit_number || "",
    floor_number: initialData?.floor_number || null,
    area: initialData?.area || null,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || null,
    status: initialData?.status || "available",
    description: initialData?.description || null,
    commission_percentage: initialData?.commission_percentage || 10
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!onSubmit) return

    const unitData: ApartmentUnit = {
      id: initialData?.id || "",
      apartment_id: apartmentId,
      unit_number: formData.unit_number,
      floor_number: formData.floor_number,
      area: formData.area,
      rent_amount: formData.rent_amount,
      deposit_amount: formData.deposit_amount,
      status: formData.status,
      description: formData.description,
      commission_percentage: formData.commission_percentage,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await onSubmit(unitData)
  }

  return {
    formData,
    setFormData,
    images,
    setImages,
    previewUrls,
    handleSubmit
  }
}