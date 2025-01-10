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
    description: initialData?.description || ""
  })

  const handleSubmit = async () => {
    if (!onSubmit) return

    const unitData: ApartmentUnit = {
      id: initialData?.id || "",
      apartment_id: apartmentId,
      ...formData
    }

    await onSubmit(unitData)
  }

  return {
    formData,
    setFormData,
    handleSubmit
  }
}