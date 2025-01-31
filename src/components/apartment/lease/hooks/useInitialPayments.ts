import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { PaymentMethod } from "@/types/payment"

export function useInitialPayments(leaseId: string, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInitialPayments = async (
    depositAmount: number,
    rentAmount: number,
    firstRentStartDate: Date,
    paymentMethod: PaymentMethod = "cash"
  ) => {
    setIsSubmitting(true)
    console.log("Starting initial payment submission:", {
      leaseId,
      depositAmount,
      rentAmount,
      firstRentStartDate: firstRentStartDate.toISOString()
    })

    try {
      // Récupérer les informations du bail
      const { data: leaseData, error: leaseError } = await supabase
        .from("apartment_leases")
        .select("agency_id")
        .eq("id", leaseId)
        .single()

      if (leaseError) {
        console.error("Error fetching lease:", leaseError)
        throw leaseError
      }

      if (!leaseData?.agency_id) {
        throw new Error("Agency ID not found")
      }

      // Appeler la fonction simplifiée
      const { data, error } = await supabase
        .rpc("handle_simple_initial_payments", {
          p_lease_id: leaseId,
          p_deposit_amount: depositAmount,
          p_agency_fees: Math.round(rentAmount * 0.5),
          p_agency_id: leaseData.agency_id
        })

      if (error) {
        console.error("Error in handle_simple_initial_payments:", error)
        throw error
      }

      toast({
        title: "Succès",
        description: "Les paiements initiaux ont été enregistrés"
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    handleInitialPayments,
    isSubmitting
  }
}