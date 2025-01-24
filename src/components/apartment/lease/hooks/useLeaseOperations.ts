import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useLeaseQueries } from "./useLeaseQueries"
import { useLeaseMutations } from "./useLeaseMutations"

export function useLeaseOperations() {
  const { leases, isLoading } = useLeaseQueries()
  const { generatePaymentPeriods, generatePaymentPeriodsDirectly } = useLeaseMutations()

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

      return true
    } catch (error: any) {
      console.error("Error deleting lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du bail",
        variant: "destructive",
      })
      return false
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