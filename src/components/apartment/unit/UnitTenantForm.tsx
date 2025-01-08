import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ContactFields } from "./form/ContactFields"
import { LeaseFields } from "./form/LeaseFields"
import { PhotoUpload } from "./form/PhotoUpload"
import { PaymentFrequency, DurationType, LeaseStatus } from "../../apartment/lease/types"

interface UnitTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function UnitTenantForm({
  unitId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: UnitTenantFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    rentAmount: "",
    depositAmount: "",
    startDate: "",
    endDate: "",
    paymentFrequency: "monthly" as PaymentFrequency,
    durationType: "fixed" as DurationType,
    status: "active" as LeaseStatus,
    photos: null as FileList | null
  })

  const handlePhotosSelected = (files: FileList) => {
    setFormData({ ...formData, photos: files })
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

      // Upload photos if any
      let photoUrls: string[] = []
      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          const file = formData.photos[i]
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
            photoUrls.push(publicUrl)
          }
        }
      }

      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          photo_id_url: photoUrls.length > 0 ? photoUrls[0] : null,
          agency_id: profile.agency_id,
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Create lease with conditional end_date
      const endDate = formData.durationType === "fixed" ? formData.endDate : null

      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: unitId,
          rent_amount: parseInt(formData.rentAmount),
          deposit_amount: parseInt(formData.depositAmount),
          start_date: formData.startDate,
          end_date: endDate,
          payment_frequency: formData.paymentFrequency,
          duration_type: formData.durationType,
          status: formData.status,
          agency_id: profile.agency_id,
        })

      if (leaseError) throw leaseError

      onSuccess()
      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès",
      })
    } catch (error: any) {
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
    <ScrollArea className="h-[600px] pr-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <ContactFields formData={formData} setFormData={setFormData} />
        <LeaseFields formData={formData} setFormData={setFormData} />
        <PhotoUpload onPhotosSelected={handlePhotosSelected} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsSubmitting(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Chargement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}