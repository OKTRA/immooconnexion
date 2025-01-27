import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function useLeaseMutations() {
  const queryClient = useQueryClient()

  const handleInitialPayments = useMutation({
    mutationFn: async ({ leaseId, depositAmount, rentAmount }: { leaseId: string, depositAmount: number, rentAmount: number }) => {
      console.log("Handling initial payments for lease:", { leaseId, depositAmount, rentAmount })
      
      try {
        // Insérer le paiement de la caution
        const { error: depositError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: leaseId,
            amount: depositAmount,
            payment_type: 'deposit',
            payment_method: 'cash',
            payment_date: new Date().toISOString(),
            due_date: new Date().toISOString(),
            status: 'paid',
            payment_status_type: 'paid'
          })

        if (depositError) throw depositError

        // Insérer le paiement des frais d'agence
        const { error: feesError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: leaseId,
            amount: Math.round(rentAmount * 0.5),
            payment_type: 'agency_fees',
            payment_method: 'cash',
            payment_date: new Date().toISOString(),
            due_date: new Date().toISOString(),
            status: 'paid',
            payment_status_type: 'paid'
          })

        if (feesError) throw feesError

        // Mettre à jour le statut du bail
        const { error: leaseError } = await supabase
          .from('apartment_leases')
          .update({
            initial_fees_paid: true,
            initial_payments_completed: true
          })
          .eq('id', leaseId)

        if (leaseError) throw leaseError

        return true
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