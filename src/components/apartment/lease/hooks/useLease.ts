import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData } from "../types"

export function useLease(unitId: string | undefined, tenantId: string) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LeaseFormData>({
    unit_id: unitId || "",
    start_date: "",
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "month_to_month",
    payment_type: "upfront"
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .maybeSingle()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // Create the lease
      const { data: lease, error: leaseError } = await supabase
        .from("apartment_leases")
        .insert([
          {
            tenant_id: tenantId,
            unit_id: formData.unit_id,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            rent_amount: formData.rent_amount,
            deposit_amount: formData.deposit_amount,
            payment_frequency: formData.payment_frequency,
            duration_type: formData.duration_type,
            payment_type: formData.payment_type,
            agency_id: userProfile.agency_id,
            status: "active"
          }
        ])
        .select()
        .single()

      if (leaseError) throw leaseError

      // Update the unit status
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitError) throw unitError

      // Create tenant_units association
      const { error: tenantUnitError } = await supabase
        .from("tenant_units")
        .insert([
          {
            tenant_id: tenantId,
            unit_id: formData.unit_id,
            status: "active"
          }
        ])

      if (tenantUnitError) throw tenantUnitError

      toast({
        title: "Bail créé",
        description: "Le bail a été créé avec succès"
      })

      return lease

    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  }
}