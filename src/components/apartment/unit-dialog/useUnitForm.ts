import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit, ApartmentUnitFormData } from "../types"

export function useUnitForm(
  apartmentId: string,
  initialData?: ApartmentUnit,
  onSuccess?: () => void
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
    minimum_stay: "",
    maximum_stay: "",
    late_fee_percentage: "",
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
        minimum_stay: initialData.minimum_stay?.toString() || "",
        maximum_stay: initialData.maximum_stay?.toString() || "",
        late_fee_percentage: initialData.late_fee_percentage?.toString() || "",
      })

      if (initialData.photo_urls) {
        setPreviewUrls(initialData.photo_urls)
      }
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

      const unitData = {
        apartment_id: apartmentId,
        unit_number: formData.unit_number,
        floor_number: parseInt(formData.floor_number) || null,
        area: parseFloat(formData.area) || null,
        rent_amount: parseInt(formData.rent_amount),
        deposit_amount: parseInt(formData.deposit_amount) || null,
        status: formData.status,
        description: formData.description,
        minimum_stay: parseInt(formData.minimum_stay || "0") || null,
        maximum_stay: parseInt(formData.maximum_stay || "0") || null,
        late_fee_percentage: parseInt(formData.late_fee_percentage || "0") || null,
        photo_urls: photo_urls.length > 0 ? photo_urls : undefined,
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("apartment_units")
          .update(unitData)
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Unité modifiée",
          description: "L'unité a été mise à jour avec succès",
        })
      } else {
        const { error } = await supabase.from("apartment_units").insert([unitData])

        if (error) throw error

        toast({
          title: "Unité ajoutée",
          description: "L'unité a été ajoutée avec succès",
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de l'unité",
        variant: "destructive",
      })
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