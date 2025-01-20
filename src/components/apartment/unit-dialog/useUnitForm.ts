import { useState } from "react"
import { ApartmentUnit, ApartmentUnitFormData } from "@/types/apartment"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSubmit?: (data: ApartmentUnit) => Promise<void>
) {
  const [formData, setFormData] = useState<ApartmentUnitFormData>({
    unit_number: initialData?.unit_number || "",
    unit_name: initialData?.unit_name || "",
    floor_number: initialData?.floor_number || null,
    area: initialData?.area || null,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || null,
    status: initialData?.status || "available",
    description: initialData?.description || null,
    commission_percentage: initialData?.commission_percentage || null,
    store_count: initialData?.store_count || 0,
    kitchen_count: initialData?.kitchen_count || 0,
    has_pool: initialData?.has_pool || false,
    living_rooms: initialData?.living_rooms || 0,
    bedrooms: initialData?.bedrooms || 0
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!onSubmit) return

    console.log("Submitting unit data:", formData)

    try {
      const unitData: ApartmentUnit = {
        id: initialData?.id || "",
        apartment_id: apartmentId,
        ...formData,
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