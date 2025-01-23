import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData } from "./types"

export function useLease(unitId: string | undefined, tenantId: string | undefined) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<LeaseFormData>({
    tenant_id: tenantId || '',
    unit_id: unitId || '',
    start_date: "",
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "fixed",
    status: "active",
    payment_type: "upfront",
    deposit_returned: false,
    deposit_return_date: "",
    deposit_return_amount: "",
    deposit_return_notes: "",
    agency_fees_percentage: 50,
    commission_percentage: 10,
  })

  const handleSubmit = async () => {
    if (!unitId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une unité",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Creating lease with data:", { ...formData, unit_id: unitId })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée à ce profil")
      }

      // Create the lease with a simplified query
      const { data: lease, error: leaseError } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: tenantId,
          unit_id: unitId,
          start_date: formData.start_date,
          end_date: formData.duration_type === "fixed" ? formData.end_date : null,
          rent_amount: formData.rent_amount,
          deposit_amount: formData.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          status: formData.status,
          payment_type: formData.payment_type,
          agency_id: profile.agency_id,
          initial_fees_paid: false
        })
        .select('id')
        .single()

      if (leaseError) throw leaseError

      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès",
      })

      return lease
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
  }
}