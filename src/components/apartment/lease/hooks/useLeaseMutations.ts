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
        // First generate payment periods
        await generatePaymentPeriods.mutateAsync(leaseId)

        // Then handle initial payments
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

  const generatePaymentPeriodsDirectly = useMutation({
    mutationFn: async (leaseId: string) => {
      console.log("Generating payment periods directly for lease:", leaseId)
      
      try {
        const { data: lease, error: leaseError } = await supabase
          .from("apartment_leases")
          .select("*")
          .eq("id", leaseId)
          .single()

        if (leaseError) throw leaseError
        if (!lease) throw new Error("Bail non trouvé")

        const periods = []
        let currentStart = new Date(lease.start_date)
        const endDate = lease.end_date ? new Date(lease.end_date) : new Date(currentStart)
        endDate.setFullYear(endDate.getFullYear() + 1)

        while (currentStart < endDate) {
          let periodEnd = new Date(currentStart)
          
          switch (lease.payment_frequency) {
            case 'daily':
              periodEnd.setDate(periodEnd.getDate() + 1)
              break
            case 'weekly':
              periodEnd.setDate(periodEnd.getDate() + 7)
              break
            case 'monthly':
              periodEnd.setMonth(periodEnd.getMonth() + 1)
              break
            case 'quarterly':
              periodEnd.setMonth(periodEnd.getMonth() + 3)
              break
            case 'yearly':
              periodEnd.setFullYear(periodEnd.getFullYear() + 1)
              break
          }
          periodEnd.setDate(periodEnd.getDate() - 1)

          periods.push({
            lease_id: leaseId,
            start_date: currentStart.toISOString().split('T')[0],
            end_date: periodEnd.toISOString().split('T')[0],
            amount: lease.rent_amount,
            status: currentStart <= new Date() ? 'pending' : 'future'
          })

          currentStart = new Date(periodEnd)
          currentStart.setDate(currentStart.getDate() + 1)
        }

        const { error: insertError } = await supabase
          .from("apartment_payment_periods")
          .insert(periods)

        if (insertError) throw insertError

        return periods
      } catch (error) {
        console.error("Error generating payment periods directly:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Succès",
        description: "Les périodes de paiement ont été générées directement avec succès",
      })
    },
    onError: (error: any) => {
      console.error("Error generating payment periods directly:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération directe des périodes de paiement",
        variant: "destructive",
      })
    }
  })

  return {
    generatePaymentPeriods,
    generatePaymentPeriodsDirectly,
    handleInitialPayments
  }
}