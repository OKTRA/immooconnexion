import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit, ApartmentUnitFormData } from "../types"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSuccess?: (data: ApartmentUnit) => Promise<void>
) {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { toast } = useToast()
  const [formData, setFormData] = useState<ApartmentUnitFormData>({
    unit_number: "",
    floor_number: "",
    area: "",
    rent_amount: "",
    deposit_amount: "",
    status: "available",
    description: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        unit_number: initialData.unit_number,
        floor_number: initialData.floor_number?.toString() || "",
        area: initialData.area?.toString() || "",
        rent_amount: initialData.rent_amount.toString(),
        deposit_amount: initialData.deposit_amount?.toString() || "",
        status: initialData.status,
        description: initialData.description || "",
      })
    }
  }, [initialData])

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map((file) => URL.createObjectURL(file))
      setPreviewUrls(urls)
      return () => urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  const handleSubmit = async () => {
    try {
      let photo_urls: string[] = []

      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split(".").pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${apartmentId}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("apartment_photos")
            .upload(filePath, image)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from("apartment_photos")
            .getPublicUrl(filePath)

          photo_urls.push(publicUrl)
        }
      }

      const unitData: ApartmentUnit = {
        id: initialData?.id || crypto.randomUUID(),
        apartment_id: apartmentId,
        unit_number: formData.unit_number,
        floor_number: parseInt(formData.floor_number) || null,
        area: parseFloat(formData.area) || null,
        rent_amount: parseInt(formData.rent_amount),
        deposit_amount: parseInt(formData.deposit_amount) || null,
        status: formData.status,
        description: formData.description || null,
      }

      if (onSuccess) {
        await onSuccess(unitData)
      }

      toast({
        title: initialData ? "Unité modifiée" : "Unité ajoutée",
        description: `L'unité a été ${initialData ? 'mise à jour' : 'ajoutée'} avec succès`,
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'unité",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    formData,
    setFormData,
    images,
    setImages,
    previewUrls,
    handleSubmit,
  }
}