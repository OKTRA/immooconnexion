import { Button } from "@/components/ui/button"
import { PersonalInfoFields } from "./form/PersonalInfoFields"
import { EmergencyFields } from "./form/EmergencyFields"
import { PhotoUpload } from "../form/PhotoUpload"
import { SimpleUnitSelector } from "./form/SimpleUnitSelector"
import { Loader2 } from "lucide-react"
import { useApartmentTenantForm } from "./hooks/useApartmentTenantForm"
import { ApartmentTenant } from "@/types/apartment"
import { format, parse } from "date-fns"

interface ApartmentTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: ApartmentTenant
}

export function ApartmentTenantForm({
  unitId,
  onSuccess,
  initialData
}: ApartmentTenantFormProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  } = useApartmentTenantForm({
    unitId,
    onSuccess,
    initialData
  })

  const handleFieldChange = (field: string, value: string) => {
    if (field === "birth_date") {
      // If empty, set to null
      if (!value) {
        setFormData(prev => ({ ...prev, [field]: null }))
        return
      }

      try {
        // If the value is already in YYYY-MM-DD format, keep it
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          setFormData(prev => ({ ...prev, [field]: value }))
        } else {
          // Otherwise, try to parse and format the date
          const parsedDate = parse(value, "yyyy-MM-dd", new Date())
          const formattedDate = format(parsedDate, "yyyy-MM-dd")
          setFormData(prev => ({ ...prev, [field]: formattedDate }))
        }
      } catch (error) {
        console.error("Date parsing error:", error)
        // If there's an error parsing the date, set to null
        setFormData(prev => ({ ...prev, [field]: null }))
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoFields
        first_name={formData.first_name}
        last_name={formData.last_name}
        email={formData.email}
        phone_number={formData.phone_number}
        birth_date={formData.birth_date || ""}
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

      <SimpleUnitSelector
        value={formData.unit_id}
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