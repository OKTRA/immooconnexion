import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function usePaymentForm() {
  return useQuery({
    queryKey: ["payment-form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_forms")
        .select("*")

      if (error) throw error
      return data || []
    }
  })
}
