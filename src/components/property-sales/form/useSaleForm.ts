import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useSubscriptionLimits } from "@/utils/subscriptionLimits"

interface SaleFormData {
  property_name: string
  neighborhood: string
  country: string
  city: string
  listing_date: string
  document_type: string
  sale_price: string
  commission_percentage: string
}

export function useSaleForm(propertyId: string, initialData?: any, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const { toast } = useToast()
  const { checkAndNotifyLimits } = useSubscriptionLimits()
  const [formData, setFormData] = useState<SaleFormData>({
    property_name: initialData?.property_name || "",
    neighborhood: initialData?.neighborhood || "",
    country: initialData?.country || "",
    city: initialData?.city || "",
    listing_date: initialData?.listing_date || new Date().toISOString().split('T')[0],
    document_type: initialData?.document_type || "",
    sale_price: initialData?.sale_price?.toString() || "",
    commission_percentage: initialData?.commission_percentage?.toString() || ""
  })

  const uploadPhotos = async (agencyId: string) => {
    if (!selectedFiles) return []

    const photoUrls = []
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${agencyId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property_sale_photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property_sale_photos')
        .getPublicUrl(filePath)

      photoUrls.push(publicUrl)
    }

    return photoUrls
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const canManageSales = await checkAndNotifyLimits(profile.agency_id, 'property')
      if (!canManageSales) {
        toast({
          title: "Plan limité",
          description: "La gestion des ventes nécessite un abonnement Professionnel ou Enterprise",
          variant: "destructive"
        })
        return
      }

      let photoUrls: string[] = []
      if (selectedFiles) {
        photoUrls = await uploadPhotos(profile.agency_id)
      }

      const commission_amount = Math.round(
        (parseFloat(formData.sale_price) * parseFloat(formData.commission_percentage)) / 100
      )

      const propertyData = {
        bien: formData.property_name,
        type: formData.document_type,
        ville: formData.city,
        sale_price: parseInt(formData.sale_price),
        taux_commission: parseFloat(formData.commission_percentage),
        is_for_sale: true,
        agency_id: profile.agency_id,
        user_id: user.id,
        photo_url: photoUrls[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('properties')
        .insert([propertyData])

      if (error) throw error

      toast({
        title: "Bien ajouté avec succès",
        description: "Le bien a été ajouté à la liste des biens à vendre"
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Error adding property:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du bien",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    isSubmitting,
    selectedFiles,
    setSelectedFiles,
    handleSubmit
  }
}