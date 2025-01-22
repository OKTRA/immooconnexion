import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { PhotoUpload } from "./form/PhotoUpload"
import { PersonalInfoFields } from "./form/PersonalInfoFields"
import { EmergencyContactsField } from "./form/EmergencyContactsField"
import { UnitSearchField } from "./form/UnitSearchField"
import { Loader2 } from "lucide-react"

interface TenantFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthDate: string
  profession: string
  photoId: File | null
  emergency_contacts: Array<{
    name: string
    phone: string
    relationship: string
  }>
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
  const [formData, setFormData] = useState<TenantFormData>({
    firstName: initialData?.first_name || "",
    lastName: initialData?.last_name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phone_number || "",
    birthDate: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    photoId: null,
    emergency_contacts: initialData?.emergency_contacts || []
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

      const tenantData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        birth_date: formData.birthDate,
        photo_id_url: photoUrl,
        profession: formData.profession,
        emergency_contacts: formData.emergency_contacts,
        agency_id: profile.agency_id,
        unit_id: unitId
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("apartment_tenants")
          .update(tenantData)
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("apartment_tenants")
          .insert([tenantData])

        if (error) throw error
      }

      toast({
        title: "Succès",
        description: initialData ? "Locataire modifié avec succès" : "Locataire ajouté avec succès",
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
        contacts={formData.emergency_contacts}
        onChange={(contacts) => setFormData(prev => ({ ...prev, emergency_contacts: contacts }))}
      />

      <PhotoUpload
        onPhotosSelected={(files) => setFormData(prev => ({ ...prev, photoId: files[0] }))}
      />

      <UnitSearchField
        unitId={unitId}
        onChange={(id) => setFormData(prev => ({ ...prev, unit_id: id }))}
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