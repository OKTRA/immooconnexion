import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ContactFields } from "./form/ContactFields"
import { LeaseFields } from "./form/LeaseFields"
import { UnitSelector } from "./form/UnitSelector"
import { PaymentFrequency, DurationType } from "../lease/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birth_date: null as string | null,
    unit_id: "",
    start_date: "",
    end_date: "",
    payment_frequency: "monthly" as PaymentFrequency,
    duration_type: "fixed" as DurationType,
  })

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.phone_number.trim() !== "" &&
      formData.unit_id !== "" &&
      formData.start_date !== "" &&
      (formData.duration_type !== "fixed" || formData.end_date !== "")
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
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
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée à ce profil")
      }

      // First, get unit information
      const { data: unit, error: unitError } = await supabase
        .from("apartment_units")
        .select("rent_amount, deposit_amount")
        .eq("id", formData.unit_id)
        .maybeSingle()

      if (unitError) throw unitError
      if (!unit) throw new Error("Unité non trouvée")

      // Create tenant first
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          birth_date: formData.birth_date,
          agency_id: profile.agency_id,
          unit_id: formData.unit_id
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Then create lease in a separate query
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: formData.unit_id,
          start_date: formData.start_date,
          end_date: formData.duration_type === "fixed" ? formData.end_date : null,
          rent_amount: unit.rent_amount,
          deposit_amount: unit.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          status: "active",
          agency_id: profile.agency_id
        })

      if (leaseError) throw leaseError

      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès.",
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
    <div className="max-h-[600px] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <ContactFields formData={formData} setFormData={setFormData} />
        <UnitSelector
          apartmentId={apartmentId}
          value={formData.unit_id}
          onChange={(value) => setFormData({ ...formData, unit_id: value })}
        />
        <LeaseFields formData={formData} setFormData={setFormData} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsSubmitting(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isFormValid()}
            className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "Chargement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </div>
  )
}