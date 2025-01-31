import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface InitialPaymentsParams {
  leaseId: string
  depositAmount: number
  rentAmount: number
  firstRentStartDate: Date
}

export function useLeaseMutations() {
  const queryClient = useQueryClient()

  const handleInitialPayments = useMutation({
    mutationFn: async ({ 
      leaseId, 
      depositAmount, 
      rentAmount,
      firstRentStartDate 
    }: InitialPaymentsParams) => {
      try {
        console.log("Starting initial payments with params:", {
          leaseId,
          depositAmount,
          rentAmount,
          firstRentStartDate: firstRentStartDate.toISOString()
        })

        const { data: leaseData, error: leaseError } = await supabase
          .from('apartment_leases')
          .select('agency_id')
          .eq('id', leaseId)
          .single()

        if (leaseError) {
          console.error("Error fetching lease:", leaseError)
          throw leaseError
        }

        if (!leaseData?.agency_id) {
          console.error("No agency ID found for lease")
          throw new Error('Agency ID not found')
        }

        const { error } = await supabase.rpc('handle_simple_initial_payments', {
          p_lease_id: leaseId,
          p_deposit_amount: depositAmount,
          p_agency_fees: Math.round(rentAmount * 0.5),
          p_agency_id: leaseData.agency_id,
          p_first_rent_start_date: firstRentStartDate.toISOString().split('T')[0]
        })

        if (error) throw error

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