import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useLeasePeriods(leaseId: string) {
  return useQuery({
    queryKey: ['lease-payments', leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select('*')
        .eq('lease_id', leaseId)
        .order('payment_period_start', { ascending: true })

      if (error) throw error
      return data
    }
  })
}