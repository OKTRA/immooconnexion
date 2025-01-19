import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { PropertyUnitFormData, PropertyUnit } from "../types/propertyUnit"

export function usePropertyUnitForm(propertyId: string, initialData?: PropertyUnit) {
  const [formData, setFormData] = useState<PropertyUnitFormData>({
    property_id: propertyId,
    unit_number: initialData?.unit_number || "",
    unit_name: initialData?.unit_name || "",
    floor_level: initialData?.floor_level || null,
    area: initialData?.area || null,
    rent_amount: initialData?.rent_amount || 0,
    deposit_amount: initialData?.deposit_amount || null,
    status: initialData?.status || "available",
    description: initialData?.description || null,
    living_rooms: initialData?.living_rooms || 0,
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    kitchen_count: initialData?.kitchen_count || 0,
    has_pool: initialData?.has_pool || false
  })

  const handleSubmit = async () => {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("property_units")
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("property_units")
          .insert({
            ...formData,
            property_id: propertyId
          })

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error("Error submitting form:", error)
      return false
    }
  }

  return {
    formData,
    setFormData,
    handleSubmit
  }
}