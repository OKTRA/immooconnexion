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

  console.log("useLease - Current formData:", formData)
  console.log("useLease - initialUnitId:", initialUnitId)

  const handleSubmit = async () => {
    console.log("handleSubmit - Attempting submission with unit_id:", formData.unit_id)
    
    try {
      if (!formData.unit_id || formData.unit_id.trim() === "") {
        console.log("handleSubmit - No unit_id found")
        toast({
          title: "Erreur de validation",
          description: "Veuillez sélectionner une unité avant de continuer",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)
      console.log("handleSubmit - Starting submission process")

      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      console.log("handleSubmit - Creating lease with data:", {
        tenant_id: tenantId,
        unit_id: formData.unit_id,
        agency_id: userProfile.agency_id,
        ...formData
      })

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

      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", formData.unit_id)

      if (unitError) throw unitError

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

      console.log("handleSubmit - Lease created successfully:", lease)

      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès"
      })

      if (onSuccess) {
        onSuccess()
      }

      return lease

    } catch (error: any) {
      console.error("Error in handleSubmit:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du bail",
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