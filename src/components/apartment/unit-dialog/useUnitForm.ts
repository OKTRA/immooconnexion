import { useState } from "react"
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSubmit?: (data: ApartmentUnit) => Promise<void>
) {
  const [formData, setFormData] = useState<ApartmentUnitFormData>({
    unit_number: initialData?.unit_number || "",
    floor_number: initialData?.floor_number || 0,
    area: initialData?.area || 0,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || 0,
    status: initialData?.status || "available",
    description: initialData?.description || "",
    photo_urls: initialData?.photo_urls || []
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.photo_urls || [])

  const handleSubmit = async () => {
    if (!onSubmit) return

    const unitData: ApartmentUnit = {
      id: initialData?.id || "",
      apartment_id: apartmentId,
      unit_number: formData.unit_number,
      floor_number: Number(formData.floor_number),
      area: Number(formData.area),
      rent_amount: Number(formData.rent_amount),
      deposit_amount: Number(formData.deposit_amount),
      status: formData.status,
      description: formData.description,
      photo_urls: formData.photo_urls,
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