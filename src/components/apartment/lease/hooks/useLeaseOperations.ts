import { supabase } from "@/lib/supabase"
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
    deleteLease
  }
}