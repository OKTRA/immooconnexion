import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { Property, PropertyFormData } from "./types"
import { useSubscriptionLimits } from "@/utils/subscriptionLimits"

export function usePropertyForm(property: Property | null | undefined, onOpenChange?: (open: boolean) => void) {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState<PropertyFormData>({
    bien: "",
    type: "",
    chambres: "",
    ville: "",
    loyer: "",
    taux_commission: "",
    caution: "",
    owner_name: "",
    owner_phone: "",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { checkAndNotifyLimits } = useSubscriptionLimits()

  useEffect(() => {
    if (property) {
      setFormData({
        bien: property.bien || "",
        type: property.type || "",
        chambres: property.chambres?.toString() || "",
        ville: property.ville || "",
        loyer: property.loyer?.toString() || "",
        taux_commission: property.taux_commission?.toString() || "",
        caution: property.caution?.toString() || "",
        owner_name: property.owner_name || "",
        owner_phone: property.owner_phone || "",
      })

      if (property.photo_url) {
        setPreviewUrls([`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`])
      }
    }
  }, [property])

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
      return () => urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [images])

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée à ce profil")
      }

      if (!property && !(await checkAndNotifyLimits(profile.agency_id, 'property'))) {
        return
      }

      let photo_urls: string[] = []
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { error: uploadError, data } = await supabase.storage
            .from('product_photos')
            .upload(fileName, image)

          if (uploadError) throw uploadError
          if (data) photo_urls.push(data.path)
        }
      }

      const propertyData = {
        bien: formData.bien,
        type: formData.type,
        chambres: parseInt(formData.chambres),
        ville: formData.ville,
        loyer: parseFloat(formData.loyer),
        taux_commission: parseFloat(formData.taux_commission),
        caution: parseFloat(formData.caution),
        photo_url: photo_urls[0], // Keep backward compatibility by using the first image
        user_id: user.id,
        agency_id: profile.agency_id,
        updated_at: new Date().toISOString(),
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
      }

      if (property?.id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
        toast({
          title: "Bien modifié avec succès",
          description: "Le bien immobilier a été mis à jour",
        })
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([{ ...propertyData, created_at: new Date().toISOString() }])

        if (error) throw error
        toast({
          title: "Bien ajouté avec succès",
          description: "Le bien immobilier a été ajouté à la liste",
        })
      }

      queryClient.invalidateQueries({ queryKey: ['properties'] })
      if (onOpenChange) onOpenChange(false)
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'opération",
        variant: "destructive",
      })
    }
  }

  return {
    images,
    setImages,
    formData,
    setFormData,
    handleSubmit,
    previewUrls
  }
}
