import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface UseLeaseProps {
  initialUnitId?: string;
  tenantId: string;
  onSuccess?: () => void;
}

export function useLease({ initialUnitId, tenantId, onSuccess }: UseLeaseProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    unit_id: initialUnitId || "",
    start_date: "",
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly" as const,
    duration_type: "month_to_month" as const,
    payment_type: "upfront" as const
  })

  const handleSubmit = async () => {
    try {
      console.log("Starting lease creation with tenant:", tenantId)
      setIsSubmitting(true)

      // Récupérer les informations de l'unité pour le loyer
      const { data: unitData, error: unitError } = await supabase
        .from("apartment_units")
        .select("rent_amount, deposit_amount")
        .eq("id", formData.unit_id)
        .single()

      if (unitError) {
        console.error("Error fetching unit data:", unitError)
        throw unitError
      }

      console.log("Unit data:", unitData)

      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      console.log("Creating lease with data:", {
        tenant_id: tenantId,
        unit_id: formData.unit_id,
        agency_id: userProfile.agency_id,
        rent_amount: unitData.rent_amount,
        deposit_amount: unitData.deposit_amount || unitData.rent_amount * 2,
        ...formData
      })

      // Créer le bail avec les montants de l'unité
      const { data: lease, error: leaseError } = await supabase
        .from("apartment_leases")
        .insert([
          {
            tenant_id: tenantId,
            unit_id: formData.unit_id,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            rent_amount: unitData.rent_amount,
            deposit_amount: unitData.deposit_amount || unitData.rent_amount * 2,
            payment_frequency: formData.payment_frequency,
            duration_type: formData.duration_type,
            payment_type: formData.payment_type,
            agency_id: userProfile.agency_id,
            status: "active"
          }
        ])
        .select()
        .single()

      if (leaseError) {
        console.error("Lease creation error:", leaseError)
        throw leaseError
      }

      // Mettre à jour le statut de l'unité
      const { error: unitUpdateError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitUpdateError) throw unitUpdateError

      // Créer l'association tenant_units
      const { error: tenantUnitError } = await supabase
        .from("tenant_units")
        .insert([
          {
            tenant_id: tenantId,
            unit_id: formData.unit_id
          }
        ])

      if (tenantUnitError) throw tenantUnitError

      toast({
        title: "Bail créé",
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