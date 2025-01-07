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
      floor_number: null,
      area: null,
      rent_amount: 0,
      deposit_amount: null,
      status: "available",
      description: null
    }
  )

  const handleSubmit = async () => {
    try {
      if (initialData?.id) {
        await updateUnit.mutateAsync({
          id: initialData.id,
          ...formData
        })
        toast({
          title: "Succès",
          description: "L'unité a été mise à jour avec succès",
        })
      } else {
        await addUnit.mutateAsync(formData)
        toast({
          title: "Succès",
          description: "L'unité a été ajoutée avec succès",
        })
      }
      return true
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
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