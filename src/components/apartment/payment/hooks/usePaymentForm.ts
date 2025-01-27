import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { PaymentFormData } from "../types"

interface UsePaymentFormProps {
  onSuccess?: () => void
}

export function usePaymentForm({ onSuccess }: UsePaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    paymentMethod: "cash",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentPeriods: [],
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      console.log("Submitting payment:", formData)

      const { data, error } = await supabase.rpc(
        'handle_mixed_payment_insertion',
        {
          p_lease_id: formData.leaseId,
          p_payment_periods: formData.paymentPeriods,
          p_payment_date: formData.paymentDate,
          p_payment_method: formData.paymentMethod,
          p_agency_id: formData.agencyId,
          p_notes: formData.notes
        }
      )

      if (error) throw error

      console.log("Payment response:", data)
      
      if (!data.success) {
        throw new Error(data.error || "Erreur lors du paiement")
      }

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
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