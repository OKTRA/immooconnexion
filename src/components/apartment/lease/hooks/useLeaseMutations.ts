import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

export function useLeaseMutations() {
  const queryClient = useQueryClient()

  const generatePaymentPeriods = useMutation({
    mutationFn: async (leaseId: string) => {
      console.log("Generating payment periods for lease:", leaseId)
      
      try {
        const { data, error } = await supabase.rpc('insert_lease_payments', {
          p_lease_id: leaseId
        })

        if (error) {
          console.error("RPC Error:", error)
          throw error
        }

        console.log("Payment periods generated successfully:", data)
        return data
      } catch (error) {
        console.error("Detailed error:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Succès",
        description: "Les périodes de paiement ont été générées avec succès",
      })
    },
    onError: (error: any) => {
      console.error("Error generating payment periods:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des périodes de paiement",
        variant: "destructive",
      })
    }
  })

  const handleInitialPayments = useMutation({
    mutationFn: async ({ leaseId, depositAmount, rentAmount }: { leaseId: string, depositAmount: number, rentAmount: number }) => {
      console.log("Handling initial payments for lease:", { leaseId, depositAmount, rentAmount })
      
      try {
        // First check if payment periods exist
        const { data: existingPeriods, error: periodsError } = await supabase
          .from('apartment_payment_periods')
          .select('id')
          .eq('lease_id', leaseId)
          .limit(1)

        if (periodsError) throw periodsError

        // If no periods exist, generate them first
        if (!existingPeriods?.length) {
          await generatePaymentPeriods.mutateAsync(leaseId)
        }

        // Then handle initial payments using RPC
        const { data, error } = await supabase.rpc('handle_initial_payments', {
          p_lease_id: leaseId,
          p_deposit_amount: depositAmount,
          p_agency_fees: Math.round(rentAmount * 0.5)
        })

        if (error) {
          console.error("RPC Error:", error)
          throw error
        }

        console.log("Initial payments handled successfully:", data)
        return data
      } catch (error) {
        console.error("Error handling initial payments:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      queryClient.invalidateQueries({ queryKey: ["lease-initial-payments"] })
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
    generatePaymentPeriods,
    handleInitialPayments
  }
}