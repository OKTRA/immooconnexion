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

        // Insert deposit payment
        const { error: depositError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: leaseId,
            amount: depositAmount,
            payment_type: 'deposit',
            payment_method: 'cash',
            payment_date: new Date().toISOString(),
            status: 'paid',
            agency_id: leaseData.agency_id,
            payment_period_start: new Date().toISOString(),
            payment_status_type: 'paid_current',
            first_rent_start_date: firstRentStartDate.toISOString()
          })

        if (depositError) {
          console.error("Error creating deposit payment:", depositError)
          throw depositError
        }

        // Insert agency fees payment
        const { error: feesError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: leaseId,
            amount: Math.round(rentAmount * 0.5),
            payment_type: 'agency_fees',
            payment_method: 'cash',
            payment_date: new Date().toISOString(),
            status: 'paid',
            agency_id: leaseData.agency_id,
            payment_period_start: new Date().toISOString(),
            payment_status_type: 'paid_current'
          })

        if (feesError) {
          console.error("Error creating agency fees payment:", feesError)
          throw feesError
        }

        // Update lease status
        const { error: updateError } = await supabase
          .from('apartment_leases')
          .update({
            initial_fees_paid: true,
            initial_payments_completed: true
          })
          .eq('id', leaseId)

        if (updateError) {
          console.error("Error updating lease status:", updateError)
          throw updateError
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