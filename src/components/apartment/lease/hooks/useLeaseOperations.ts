import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLeaseQueries } from "./useLeaseQueries"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function useLeaseOperations() {
  const queryClient = useQueryClient()
  const { leases, isLoading } = useLeaseQueries()

  const generatePaymentPeriods = useMutation({
    mutationFn: async (leaseId: string) => {
      const { data, error } = await supabase
        .rpc('generate_lease_payment_periods', { p_lease_id: leaseId })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast.success("Périodes de paiement générées avec succès")
    },
    onError: (error) => {
      console.error("Error generating payment periods:", error)
      toast.error("Erreur lors de la génération des périodes de paiement")
    }
  })

  const generatePaymentPeriodsDirectly = useMutation({
    mutationFn: async (leaseId: string) => {
      const { data, error } = await supabase
        .rpc('generate_lease_payment_periods_directly', { p_lease_id: leaseId })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast.success("Périodes de paiement générées avec succès")
    },
    onError: (error) => {
      console.error("Error generating payment periods directly:", error)
      toast.error("Erreur lors de la génération des périodes de paiement")
    }
  })

  const deleteLease = async (leaseId: string) => {
    const { error } = await supabase
      .from("apartment_leases")
      .delete()
      .eq("id", leaseId)

    if (error) {
      console.error("Error deleting lease:", error)
      toast.error("Erreur lors de la suppression du bail")
      throw error
    }

    queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
    toast.success("Bail supprimé avec succès")
  }

  return {
    leases,
    isLoading,
    generatePaymentPeriods,
    generatePaymentPeriodsDirectly,
    deleteLease
  }
}