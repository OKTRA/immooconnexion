import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function useLeaseMutations() {
  const queryClient = useQueryClient()

  const handleInitialPayments = useMutation({
    mutationFn: async ({ leaseId, depositAmount, rentAmount }: { leaseId: string, depositAmount: number, rentAmount: number }) => {
      console.log("Handling initial payments for lease:", { leaseId, depositAmount, rentAmount })
      
      try {
        // Récupérer l'agency_id du bail
        const { data: leaseData, error: leaseError } = await supabase
          .from('apartment_leases')
          .select('agency_id')
          .eq('id', leaseId)
          .maybeSingle()

        if (leaseError) throw leaseError
        if (!leaseData?.agency_id) throw new Error('Agency ID not found')

        // Utiliser la nouvelle fonction SQL pour les paiements initiaux
        const { data, error } = await supabase
          .rpc('handle_simple_initial_payments', {
            p_lease_id: leaseId,
            p_deposit_amount: depositAmount,
            p_agency_fees: Math.round(rentAmount * 0.5),
            p_agency_id: leaseData.agency_id
          })

        if (error) {
          console.error("Error in handle_simple_initial_payments:", error)
          throw error
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Unknown error occurred')
        }

        return true
      } catch (error) {
        console.error("Error in handleInitialPayments:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lease"] })
      queryClient.invalidateQueries({ queryKey: ["lease-payment-stats"] })
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