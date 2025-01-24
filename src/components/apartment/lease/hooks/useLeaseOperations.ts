import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

export function useLeaseOperations() {
  const queryClient = useQueryClient()

  const { data: leases = [], isLoading, refetch } = useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(
            id,
            first_name,
            last_name,
            phone_number
          ),
          unit:apartment_units(
            id,
            unit_number,
            apartment:apartments(
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching leases:", error)
        throw error
      }

      return data
    },
  })

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

  const generatePaymentPeriodsDirectly = useMutation({
    mutationFn: async (leaseId: string) => {
      console.log("Generating payment periods directly for lease:", leaseId)
      
      try {
        // Récupérer d'abord les informations du bail
        const { data: lease, error: leaseError } = await supabase
          .from("apartment_leases")
          .select("*")
          .eq("id", leaseId)
          .single()

        if (leaseError) throw leaseError
        if (!lease) throw new Error("Bail non trouvé")

        // Calculer les périodes en fonction de la fréquence
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

        // Insérer toutes les périodes
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

  const deleteLease = async (leaseId: string) => {
    try {
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .delete()
        .eq("id", leaseId)

      if (leaseError) throw leaseError

      const lease = leases.find(l => l.id === leaseId)
      if (lease?.unit_id) {
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "available" })
          .eq("id", lease.unit_id)

        if (unitError) throw unitError
      }

      toast({
        title: "Bail supprimé",
        description: "Le bail a été supprimé avec succès",
      })

      refetch()
    } catch (error: any) {
      console.error("Error deleting lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du bail",
        variant: "destructive",
      })
    }
  }

  return {
    leases,
    isLoading,
    generatePaymentPeriods,
    generatePaymentPeriodsDirectly,
    deleteLease
  }
}