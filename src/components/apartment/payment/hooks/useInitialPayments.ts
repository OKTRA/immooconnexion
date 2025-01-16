import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
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

      // Start a transaction for deposit payment
      const { data: depositPayment, error: depositError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: data.deposit_amount,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "deposit",
        })
        .select()
        .single()

      if (depositError) {
        console.error("Erreur lors du paiement de la caution:", depositError)
        throw new Error(`Erreur lors du paiement de la caution: ${depositError.message}`)
      }

      console.log("Paiement de la caution enregistré avec succès", depositPayment)

      // Create agency fees payment
      const { error: feesError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: data.agency_fees,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "agency_fees",
        })

      if (feesError) {
        console.error("Erreur lors du paiement des frais d'agence:", feesError)
        throw new Error(`Erreur lors du paiement des frais d'agence: ${feesError.message}`)
      }

      console.log("Paiement des frais d'agence enregistré avec succès")

      // Update lease status
      const { error: updateError } = await supabase
        .from("apartment_leases")
        .update({
          initial_fees_paid: true,
          initial_payments_completed: true,
        })
        .eq("id", leaseId)

      if (updateError) {
        console.error("Erreur lors de la mise à jour du statut du bail:", updateError)
        throw new Error(`Erreur lors de la mise à jour du statut du bail: ${updateError.message}`)
      }

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