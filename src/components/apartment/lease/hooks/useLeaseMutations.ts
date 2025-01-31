import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
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

        // Call the updated function with first_rent_start_date
        const { data, error } = await supabase
          .rpc('handle_simple_initial_payments', {
            p_lease_id: leaseId,
            p_deposit_amount: depositAmount,
            p_agency_fees: Math.round(rentAmount * 0.5),
            p_agency_id: leaseData.agency_id,
            p_first_rent_start_date: firstRentStartDate.toISOString()
          })

        if (error) {
          console.error("Error in handle_simple_initial_payments:", error)
          throw error
        }

        // Appeler la fonction de génération des périodes
        console.log("Calling generate_payment_periods function...")
        const { error: periodsError } = await supabase
          .rpc('generate_payment_periods', { 
            p_lease_id: leaseId,
            p_start_date: firstRentStartDate.toISOString(),
            p_frequency: 'monthly'
          })

        if (periodsError) {
          console.error("Error generating payment periods:", periodsError)
          throw periodsError
        }

        console.log("Initial payments completed successfully")
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