import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData } from "../types"

interface UseLeaseProps {
  initialUnitId?: string
  tenantId: string
  onSuccess?: () => void
}

export function useLease({ initialUnitId, tenantId, onSuccess }: UseLeaseProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LeaseFormData>({
    unit_id: initialUnitId || "",
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
      if (!formData.unit_id) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une unité",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // Créer le bail
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

      // Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitError) throw unitError

      // Créer l'association tenant_units
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
        title: "Succès",
        description: "Le bail a été créé avec succès"
      })

      if (onSuccess) {
        onSuccess()
      }

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