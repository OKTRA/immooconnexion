import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"

interface UseTenantFormProps {
  onSuccess: () => void
  initialData?: ApartmentTenant
  unitId: string
}

export function useTenantForm({ onSuccess, initialData, unitId }: UseTenantFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.photo_id_url || "")

  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    additional_notes: "",
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

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

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      let photo_id_url = initialData?.photo_id_url
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from("tenant_photos")
          .upload(fileName, photoFile)

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
        agency_id: profile.agency_id,
        unit_id: unitId,
        profession: formData.profession,
      }

      let tenantId: string

      if (initialData?.id) {
        const { error } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", initialData.id)

        if (error) throw error
        tenantId = initialData.id
      } else {
        const { data: tenant, error } = await supabase
          .from("apartment_tenants")
          .insert([tenantData])
          .select()
          .single()

        if (error) throw error
        tenantId = tenant.id
      }

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", unitId)

      if (unitError) throw unitError

      toast({
        title: initialData ? "Locataire modifié" : "Locataire ajouté",
        description: "Les informations ont été enregistrées avec succès.",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    previewUrl,
    handlePhotoChange,
    handleSubmit,
    isSubmitting
  }
}