import { Button } from "@/components/ui/button"
import { PersonalInfoFields } from "./form/PersonalInfoFields"
import { EmergencyFields } from "./form/EmergencyFields"
import { PhotoUpload } from "../form/PhotoUpload"
import { Loader2 } from "lucide-react"
import { useApartmentTenantForm } from "./hooks/useApartmentTenantForm"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantFormProps {
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: ApartmentTenant
}

export function ApartmentTenantForm({
  onSuccess,
  initialData
}: ApartmentTenantFormProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  } = useApartmentTenantForm({
    onSuccess,
    initialData
  })

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

      <EmergencyFields
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