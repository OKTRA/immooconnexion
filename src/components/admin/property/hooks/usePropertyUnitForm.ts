import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PropertyUnitFormData } from "../types/propertyUnit"
import { usePropertyUnits } from "@/hooks/use-property-units"

export function usePropertyUnitForm(propertyId: string, initialData?: PropertyUnitFormData) {
  const { addUnit, updateUnit } = usePropertyUnits(propertyId)
  const { toast } = useToast()
  const [formData, setFormData] = useState<PropertyUnitFormData>(
    initialData || {
      property_id: propertyId,
      unit_number: "",
      floor_level: null,
      area: null,
      rent_amount: 0,
      deposit_amount: null,
      status: "available",
      description: null,
      living_rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      store_count: 0,
      kitchen_description: null,
      has_pool: false,
      unit_name: null
    }
  )

  const handleSubmit = async () => {
    try {
      if (!propertyId) {
        throw new Error("Property ID is required")
      }

      if (initialData?.id) {
        await updateUnit.mutateAsync({
          id: initialData.id,
          property_id: propertyId,
          ...formData
        })
        toast({
          title: "Succès",
          description: "L'unité a été mise à jour avec succès",
        })
      } else {
        await addUnit.mutateAsync({
          ...formData,
          property_id: propertyId
        })
        toast({
          title: "Succès",
          description: "L'unité a été ajoutée avec succès",
        })
      }
      return true
    } catch (error) {
      console.error("Error submitting unit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    formData,
    setFormData,
    handleSubmit
  }
}