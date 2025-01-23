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
    unit_id: unitId || initialData?.unit_id || "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "fixed",
    start_date: "",
    end_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Vérifier que l'utilisateur est authentifié
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      // 2. Récupérer l'agency_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) {
        throw new Error("Agency ID not found")
      }

      // 3. Vérifier que l'unité est disponible
      const { data: unit, error: unitError } = await supabase
        .from('apartment_units')
        .select('*')
        .eq('id', formData.unit_id)
        .single()

      if (unitError) throw unitError
      if (unit.status !== 'available') {
        throw new Error("Cette unité n'est pas disponible")
      }

      // 4. Upload de la photo si présente
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

      // 5. Créer le locataire
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
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
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // 6. Créer le bail
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: formData.unit_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          status: 'active',
          agency_id: profile.agency_id,
          payment_type: 'upfront'
        })

      if (leaseError) throw leaseError

      // 7. Mettre à jour le statut de l'unité
      const { error: updateUnitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (updateUnitError) throw updateUnitError

      await queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })
      await queryClient.invalidateQueries({ queryKey: ["apartment-units"] })

      toast({
        title: "Succès",
        description: "Le locataire et le bail ont été créés avec succès",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création",
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