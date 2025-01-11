import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ContactFields } from "./form/ContactFields"
import { LeaseFields } from "./form/LeaseFields"
import { PhotoUpload } from "./form/PhotoUpload"
import { PaymentFrequency, DurationType, LeaseStatus } from "../lease/types"

export interface ApartmentTenantFormProps {
  apartmentId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: any
}

export function ApartmentTenantForm({
  apartmentId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    rentAmount: "",
    depositAmount: "",
    agencyFees: "",
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

      // Créer le locataire
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          birth_date: formData.birthDate,
          photo_id_url: photoUrls.length > 0 ? photoUrls[0] : null,
          agency_id: profile.agency_id,
          unit_id: apartmentId,
          agency_fees: parseInt(formData.agencyFees)
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Créer le bail
      const { data: lease, error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: apartmentId,
          rent_amount: parseInt(formData.rentAmount),
          deposit_amount: parseInt(formData.depositAmount),
          start_date: formData.startDate,
          end_date: formData.durationType === "fixed" ? formData.endDate : null,
          payment_frequency: formData.paymentFrequency,
          duration_type: formData.durationType,
          status: formData.status,
          agency_id: profile.agency_id,
          payment_type: "upfront"
        })
        .select()
        .single()

      if (leaseError) throw leaseError

      // Créer les paiements initiaux
      const payments = [
        {
          lease_id: lease.id,
          amount: parseInt(formData.agencyFees),
          due_date: formData.startDate,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'agency_fees'
        },
        {
          lease_id: lease.id,
          amount: parseInt(formData.depositAmount),
          due_date: formData.startDate,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'deposit'
        }
      ]

      const { error: paymentsError } = await supabase
        .from('apartment_lease_payments')
        .insert(payments)

      if (paymentsError) throw paymentsError

      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès",
      })

      onSuccess()
    } catch (error: any) {
      console.error('Error:', error)
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
    <div className="max-h-[600px] overflow-y-auto px-4">
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
    </div>
  )
}