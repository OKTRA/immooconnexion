import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { ContactFields } from "./form/ContactFields"
import { ProfessionalFields } from "./form/ProfessionalFields"
import { EmergencyContactFields } from "./form/EmergencyContactFields"
import { UnitSelector } from "./form/UnitSelector"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantFormProps {
  apartmentId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  initialData?: ApartmentTenant
}

export function ApartmentTenantForm({
  apartmentId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const [selectedUnitId, setSelectedUnitId] = useState(initialData?.unit_id || "")
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || "",
    photo_id_url: initialData?.photo_id_url || "",
    employer_name: initialData?.employer_name || "",
    employer_phone: initialData?.employer_phone || "",
    employer_address: initialData?.employer_address || "",
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_phone: initialData?.emergency_contact_phone || "",
    emergency_contact_relationship: initialData?.emergency_contact_relationship || "",
    additional_notes: initialData?.additional_notes || "",
    bank_name: initialData?.bank_name || "",
    bank_account_number: initialData?.bank_account_number || "",
    agency_fees: initialData?.agency_fees || 0,
    profession: initialData?.profession || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnitId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une unité",
        variant: "destructive",
      })
      return
    }

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

      const tenantData = {
        ...formData,
        unit_id: selectedUnitId,
        agency_id: profile.agency_id,
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

        // Update unit status to occupied
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "occupied" })
          .eq("id", selectedUnitId)

        if (unitError) throw unitError
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
      <div className="space-y-4">
        <UnitSelector
          apartmentId={apartmentId}
          value={selectedUnitId}
          onChange={setSelectedUnitId}
        />
        <Separator className="my-4" />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            <ContactFields formData={formData} setFormData={setFormData} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Informations professionnelles</h3>
            <ProfessionalFields formData={formData} setFormData={setFormData} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Contact d'urgence</h3>
            <EmergencyContactFields formData={formData} setFormData={setFormData} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !selectedUnitId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : initialData ? (
            "Modifier"
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </form>
  )
}