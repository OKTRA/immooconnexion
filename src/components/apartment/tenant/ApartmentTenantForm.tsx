import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { PhotoUpload } from "../form/PhotoUpload"
import { PersonalInfoFields } from "./form/PersonalInfoFields"
import { EmergencyContactsField } from "./form/EmergencyContactsField"
import { SimpleUnitSelector } from "./form/SimpleUnitSelector"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

interface TenantFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthDate: string
  profession: string
  photoId: File | null
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  unit_id?: string
}

interface ApartmentTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: any
}

export function ApartmentTenantForm({
  unitId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<TenantFormData>({
    firstName: initialData?.first_name || "",
    lastName: initialData?.last_name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phone_number || "",
    birthDate: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    photoId: null,
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_phone: initialData?.emergency_contact_phone || "",
    emergency_contact_relationship: initialData?.emergency_contact_relationship || "",
    unit_id: unitId || initialData?.unit_id || ""
  })

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

      // Créer le locataire
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
        unit_id: formData.unit_id
      }

      let tenantId: string
      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", initialData.id)

        if (updateError) throw updateError
        tenantId = initialData.id
      } else {
        const { data: tenant, error: insertError } = await supabase
          .from("apartment_tenants")
          .insert([tenantData])
          .select()
          .single()

        if (insertError) throw insertError
        if (!tenant) throw new Error("No tenant data returned")
        tenantId = tenant.id
      }

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitError) throw unitError

      // Invalider les caches pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })
      queryClient.invalidateQueries({ queryKey: ["apartment-units"] })

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email}
        phoneNumber={formData.phoneNumber}
        birthDate={formData.birthDate}
        profession={formData.profession}
        onChange={handleFieldChange}
      />

      <EmergencyContactsField
        contactName={formData.emergency_contact_name}
        contactPhone={formData.emergency_contact_phone}
        contactRelationship={formData.emergency_contact_relationship}
        onChange={handleFieldChange}
      />

      <PhotoUpload
        onPhotoChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setFormData(prev => ({ ...prev, photoId: file }))
          }
        }}
        previewUrls={[]}
      />

      <SimpleUnitSelector
        value={formData.unit_id || ""}
        onValueChange={(value) => setFormData(prev => ({ ...prev, unit_id: value }))}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : initialData ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}