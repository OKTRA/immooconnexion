import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { Apartment } from "@/integrations/supabase/types/apartments"
import { useSubscriptionLimits } from "@/utils/subscriptionLimits"

interface ApartmentFormData {
  name: string;
  city: string;
  country: string;
  owner_name: string;
  owner_phone: string;
  total_units: string;
}

export function useApartmentForm(apartment: Apartment | null | undefined, onSuccess?: () => void) {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState<ApartmentFormData>({
    name: "",
    city: "",
    country: "CI",
    owner_name: "",
    owner_phone: "",
    total_units: "1",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { checkAndNotifyLimits } = useSubscriptionLimits()

  useEffect(() => {
    if (apartment) {
      setFormData({
        name: apartment.name || "",
        city: apartment.city || "",
        country: apartment.country || "CI",
        owner_name: apartment.owner_name || "",
        owner_phone: apartment.owner_phone || "",
        total_units: apartment.total_units?.toString() || "1",
      })

      if (apartment.photo_url) {
        setPreviewUrls([`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${apartment.photo_url}`])
      }
    }
  }, [apartment])

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
        .single()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée à ce profil")
      }

      if (!apartment && !(await checkAndNotifyLimits(profile.agency_id, 'property'))) {
        return
      }

      let photo_url: string | null = null
      if (images.length > 0) {
        const fileExt = images[0].name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('product_photos')
          .upload(fileName, images[0])

        if (uploadError) throw uploadError
        if (data) photo_url = data.path
      }

      const apartmentData = {
        name: formData.name,
        city: formData.city,
        country: formData.country,
        photo_url,
        agency_id: profile.agency_id,
        created_by_user_id: user.id,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        total_units: parseInt(formData.total_units),
        status: 'disponible',
      }

      if (apartment?.id) {
        const { error } = await supabase
          .from('apartments')
          .update(apartmentData)
          .eq('id', apartment.id)

        if (error) throw error
        toast({
          title: "Immeuble modifié avec succès",
          description: "L'immeuble a été mis à jour",
        })
      } else {
        const { error } = await supabase
          .from('apartments')
          .insert([apartmentData])

        if (error) throw error
        toast({
          title: "Immeuble ajouté avec succès",
          description: "L'immeuble a été ajouté à la liste",
        })
      }

      queryClient.invalidateQueries({ queryKey: ['apartments'] })
      if (onSuccess) onSuccess()
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