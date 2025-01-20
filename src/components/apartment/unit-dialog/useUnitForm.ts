import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"

export type ApartmentUnitFormData = Omit<ApartmentUnit, 'id' | 'created_at' | 'updated_at'>

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSubmit?: (data: ApartmentUnit) => Promise<void>
) {
  const [formData, setFormData] = useState<ApartmentUnitFormData>({
    apartment_id: apartmentId,
    unit_number: initialData?.unit_number || "",
    floor_number: initialData?.floor_number || null,
    area: initialData?.area || null,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || null,
    status: initialData?.status || "available",
    description: initialData?.description || null,
    commission_percentage: initialData?.commission_percentage || null,
    store_count: initialData?.store_count || 0,
    kitchen_count: initialData?.kitchen_count || 0,
    has_pool: initialData?.has_pool || false
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!onSubmit) return

    console.log("Submitting unit data:", formData)

    try {
      const unitData: ApartmentUnit = {
        id: initialData?.id || "",
        ...formData,
        apartment_id: apartmentId,
      }

      await onSubmit(unitData)
      console.log("Unit submitted successfully")
    } catch (error) {
      console.error("Error submitting unit:", error)
      throw error
    }
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