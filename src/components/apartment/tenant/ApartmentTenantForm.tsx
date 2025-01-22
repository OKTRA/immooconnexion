import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ContactFields } from "./form/ContactFields"
import { LeaseFields } from "./form/LeaseFields"
import { PhotoUpload } from "./form/PhotoUpload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UnitSearchField } from "./form/UnitSearchField"

export interface TenantFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birth_date: string | null
  profession: string
  rent_amount: string
  deposit_amount: string
  start_date: string
  end_date: string
  payment_frequency: "monthly" | "weekly" | "daily" | "quarterly" | "yearly"
  duration_type: "fixed" | "month_to_month" | "yearly"
  photos: FileList | null
  emergency_contacts?: Array<{
    name: string
    phone: string
    relationship: string
  }>
}

export interface ApartmentTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: any
}

const initialFormData: TenantFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  birth_date: null,
  profession: "",
  rent_amount: "",
  deposit_amount: "",
  start_date: "",
  end_date: "",
  payment_frequency: "monthly",
  duration_type: "fixed",
  photos: null,
  emergency_contacts: []
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
    ...initialFormData,
    ...initialData
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
      if (formData.photos?.length) {
        const file = formData.photos[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tenant_photos')
          .upload(fileName, file)

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
        email: formData.email || null,
        phone_number: formData.phoneNumber,
        birth_date: formData.birth_date || null,
        photo_id_url: photoUrl,
        profession: formData.profession || null,
        emergency_contacts: formData.emergency_contacts || [],
        agency_id: profile.agency_id,
        unit_id: unitId
      }

      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert(tenantData)
        .select()
        .single()

      if (tenantError) throw tenantError

      const leaseData = {
        tenant_id: tenant.id,
        unit_id: unitId,
        start_date: formData.start_date || null,
        end_date: formData.duration_type === "fixed" ? formData.end_date || null : null,
        rent_amount: parseInt(formData.rent_amount) || 0,
        deposit_amount: parseInt(formData.deposit_amount) || 0,
        payment_frequency: formData.payment_frequency,
        duration_type: formData.duration_type,
        status: "active",
        agency_id: profile.agency_id
      }

      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert(leaseData)

      if (leaseError) throw leaseError

      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-h-[600px] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ContactFields formData={formData} setFormData={setFormData} />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="Profession du locataire"
                />
              </div>
            </div>

            <PhotoUpload onPhotosSelected={(files) => setFormData({ ...formData, photos: files })} />
          </div>

          <div className="space-y-6">
            <UnitSearchField
              unitId={unitId}
              onChange={(id) => setFormData({ ...formData, unit_id: id })}
            />
            <LeaseFields formData={formData} setFormData={setFormData} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={() => onSuccess()} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Chargement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </div>
  )
}