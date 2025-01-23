import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ApartmentTenant } from "@/types/apartment"

interface UseApartmentTenantFormProps {
  onSuccess: () => void
  initialData?: ApartmentTenant
}

export function useApartmentTenantForm({
  onSuccess,
  initialData
}: UseApartmentTenantFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_phone: initialData?.emergency_contact_phone || "",
    emergency_contact_relationship: initialData?.emergency_contact_relationship || "",
    photoId: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      let photo_id_url = initialData?.photo_id_url
      if (formData.photoId) {
        const fileExt = formData.photoId.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        
        const { error: uploadError, data } = await supabase.storage
          .from("tenant_photos")
          .upload(fileName, formData.photoId)

        if (uploadError) throw uploadError

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from("tenant_photos")
            .getPublicUrl(data.path)
          photo_id_url = publicUrl
        }
      }

      const tenantData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        birth_date: formData.birth_date,
        photo_id_url,
        profession: formData.profession,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        agency_id: profile.agency_id
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("apartment_tenants")
          .insert([tenantData])

        if (insertError) throw insertError
      }

      toast({
        title: initialData ? "Locataire modifié" : "Locataire ajouté",
        description: "Les informations ont été enregistrées avec succès"
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
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
    handleSubmit
  }
}