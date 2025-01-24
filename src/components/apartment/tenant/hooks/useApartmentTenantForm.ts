import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { ApartmentTenant } from "@/types/apartment"

interface UseApartmentTenantFormProps {
  unitId: string
  onSuccess: () => void
  initialData?: ApartmentTenant
}

export function useApartmentTenantForm({
  unitId,
  onSuccess,
  initialData
}: UseApartmentTenantFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: initialData?.first_name || "",
    lastName: initialData?.last_name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phone_number || "",
    birthDate: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    photoId: null as File | null,
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_phone: initialData?.emergency_contact_phone || "",
    emergency_contact_relationship: initialData?.emergency_contact_relationship || "",
    unit_id: unitId || initialData?.unit_id || ""
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

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      let photoUrl: string | null = null
      if (formData.photoId) {
        const fileExt = formData.photoId.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tenant_photos')
          .upload(fileName, formData.photoId)

        if (uploadError) throw uploadError
        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('tenant_photos')
            .getPublicUrl(uploadData.path)
          photoUrl = publicUrl
        }
      }

      const tenantData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        birth_date: formData.birthDate,
        photo_id_url: photoUrl,
        profession: formData.profession,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        agency_id: profile.agency_id,
        unit_id: formData.unit_id,
        status: 'active'
      }

      // Start a transaction using multiple operations
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .upsert(initialData?.id ? { id: initialData.id, ...tenantData } : tenantData)
        .select()
        .single()

      if (tenantError) throw tenantError

      // Update unit status to occupied
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitError) throw unitError

      await queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })
      await queryClient.invalidateQueries({ queryKey: ["apartment-units"] })

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
    isSubmitting,
    handleSubmit
  }
}