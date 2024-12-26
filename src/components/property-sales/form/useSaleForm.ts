import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useSubscriptionLimits } from "@/utils/subscriptionLimits"

interface SaleFormData {
  buyer_name: string
  buyer_contact: string
  sale_price: string
  commission_amount: string
  sale_date: string
}

export function useSaleForm(propertyId: string, initialData?: any, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const { toast } = useToast()
  const { checkAndNotifyLimits } = useSubscriptionLimits()
  const [formData, setFormData] = useState<SaleFormData>({
    buyer_name: initialData?.buyer_name || "",
    buyer_contact: initialData?.buyer_contact || "",
    sale_price: initialData?.sale_price || "",
    commission_amount: initialData?.commission_amount || "",
    sale_date: initialData?.sale_date || new Date().toISOString().split('T')[0]
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

      const saleData = {
        property_id: propertyId,
        buyer_name: formData.buyer_name,
        buyer_contact: formData.buyer_contact,
        sale_price: parseInt(formData.sale_price),
        commission_amount: parseInt(formData.commission_amount),
        sale_date: formData.sale_date,
        agency_id: profile.agency_id,
        photo_urls: photoUrls
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('property_sales')
          .update(saleData)
          .eq('id', initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('property_sales')
          .insert([saleData])

        if (error) throw error
      }

      toast({
        title: initialData ? "Vente mise à jour" : "Vente enregistrée",
        description: initialData ? 
          "La vente a été mise à jour avec succès" : 
          "La vente a été enregistrée avec succès"
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Error recording sale:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de la vente",
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