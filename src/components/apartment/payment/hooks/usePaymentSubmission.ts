import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { LeaseData, PaymentFormData } from "../types"

export function usePaymentSubmission(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (
    formData: PaymentFormData,
    selectedLease: LeaseData,
    selectedPeriods: string[],
    agencyId: string
  ) => {
    try {
      setIsSubmitting(true)

      const { error } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: selectedLease.id,
          amount: formData.amount,
          payment_method: formData.paymentMethod,
          status: "pending",
          agency_id: agencyId,
          payment_periods: selectedPeriods
        })

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ["lease-payments"] })
      
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    handleSubmit
  }
}