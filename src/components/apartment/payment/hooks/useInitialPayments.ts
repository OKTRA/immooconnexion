import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface UseInitialPaymentsProps {
  leaseId: string
  agencyId: string
}

export function useInitialPayments({ leaseId, agencyId }: UseInitialPaymentsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInitialPayments = async (data: {
    deposit_amount: number
    agency_fees: number
  }) => {
    setIsSubmitting(true)
    try {
      console.log("Début de la soumission des paiements initiaux", { data, leaseId, agencyId })

      const { data: result, error } = await supabase
        .rpc('handle_initial_payments', {
          p_lease_id: leaseId,
          p_deposit_amount: data.deposit_amount,
          p_agency_fees: data.agency_fees
        })

      if (error) {
        console.error("Erreur lors des paiements initiaux:", error)
        throw new Error(`Erreur lors des paiements initiaux: ${error.message}`)
      }

      if (!result.success) {
        console.error("Échec des paiements initiaux:", result.error)
        throw new Error(result.error)
      }

      console.log("Paiements initiaux réussis:", result)

      toast({
        title: "Paiements initiaux enregistrés",
        description: "Les paiements ont été enregistrés avec succès",
      })

      return true
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement des paiements:", error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    handleInitialPayments,
    isSubmitting,
  }
}