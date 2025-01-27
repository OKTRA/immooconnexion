import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function useLeaseMutations() {
  const queryClient = useQueryClient()

  const handleInitialPayments = useMutation({
    mutationFn: async ({ leaseId, depositAmount, rentAmount }: { leaseId: string, depositAmount: number, rentAmount: number }) => {
      console.log("Handling initial payments for lease:", { leaseId, depositAmount, rentAmount })
      
      try {
        // Créer le paiement de la caution
        const { data: depositPayment, error: depositError } = await supabase.rpc(
          'create_lease_payment',
          {
            p_lease_id: leaseId,
            p_amount: depositAmount,
            p_payment_type: 'deposit',
            p_payment_method: 'cash',
            p_payment_date: new Date().toISOString(),
          }
        )

        if (depositError) throw depositError

        // Créer le paiement des frais d'agence
        const { data: feesPayment, error: feesError } = await supabase.rpc(
          'create_lease_payment',
          {
            p_lease_id: leaseId,
            p_amount: Math.round(rentAmount * 0.5),
            p_payment_type: 'agency_fees',
            p_payment_method: 'cash',
            p_payment_date: new Date().toISOString(),
          }
        )

        if (feesError) throw feesError

        return { depositPayment, feesPayment }
      } catch (error) {
        console.error("Error handling initial payments:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Succès",
        description: "Les paiements initiaux ont été enregistrés avec succès",
      })
    },
    onError: (error: any) => {
      console.error("Error handling initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements initiaux",
        variant: "destructive",
      })
    }
  })

  return {
    handleInitialPayments
  }
}