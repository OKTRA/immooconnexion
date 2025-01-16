import { useState } from "react"
import { ApartmentUnit } from "@/types/apartment"
import { supabase } from "@/integrations/supabase/client"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSubmit?: (data: ApartmentUnit) => Promise<void>
) {
  const [formData, setFormData] = useState<ApartmentUnit>({
    id: initialData?.id || "",
    apartment_id: apartmentId,
    unit_number: initialData?.unit_number || "",
    floor_number: initialData?.floor_number || null,
    area: initialData?.area || null,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || null,
    status: initialData?.status || "available",
    description: initialData?.description || null,
    commission_percentage: initialData?.commission_percentage || null
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!onSubmit) return

    console.log("Submitting unit data:", formData)

    try {
      // Si c'est une modification, on garde l'ID existant
      const unitData: ApartmentUnit = {
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