import { useState } from "react"
import { Property } from "@/integrations/supabase/types/properties"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function usePropertyForm(property: Property | null, onSuccess?: () => void) {
  const [images, setImages] = useState<File[]>([])
  const { toast } = useToast()
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState({
    bien: property?.bien || '',
    type: property?.type || '',
    chambres: property?.chambres?.toString() || '',
    ville: property?.ville || '',
    loyer: property?.loyer?.toString() || '',
    taux_commission: property?.taux_commission?.toString() || '',
    caution: property?.caution?.toString() || '',
    frais_agence: property?.frais_agence?.toString() || '',
    property_category: property?.property_category || 'house',
    owner_name: property?.owner_name || '',
    owner_phone: property?.owner_phone || '',
    country: property?.country || '',
    quartier: property?.quartier || ''
  })

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
        throw new Error("Aucune agence associée")
      }

      let photoUrl = property?.photo_url

      if (images.length > 0) {
        const file = images[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product_photos')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        photoUrl = filePath
      }

      const propertyData = {
        bien: formData.bien,
        type: formData.type,
        chambres: formData.chambres ? parseInt(formData.chambres) : null,
        ville: formData.ville,
        loyer: formData.loyer ? parseInt(formData.loyer) : null,
        taux_commission: formData.taux_commission ? parseInt(formData.taux_commission) : null,
        caution: formData.caution ? parseInt(formData.caution) : null,
        frais_agence: formData.frais_agence ? parseInt(formData.frais_agence) : null,
        photo_url: photoUrl,
        agency_id: profile.agency_id,
        property_category: formData.property_category,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        country: formData.country,
        quartier: formData.quartier
      }

      if (property) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData])

        if (error) throw error
      }

      toast({
        title: property ? "Bien modifié" : "Bien ajouté",
        description: "L'opération a été effectuée avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message,
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