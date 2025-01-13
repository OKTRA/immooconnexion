import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: "cash" | "bank_transfer" | "mobile_money"
  paymentPeriods: string[]
}

export interface LeaseData {
  id: string
  rent_amount: number
  tenant_id: string
  unit_id: string
  apartment_tenants: {
    first_name: string
    last_name: string
  }
  apartment_units: {
    unit_number: string
    apartment: {
      name: string
    }
  }
}

export function usePaymentForm(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>("")

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery({
    queryKey: ["active-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          id,
          rent_amount,
          tenant_id,
          unit_id,
          apartment_tenants (
            first_name,
            last_name
          ),
          apartment_units (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("status", "active")

      if (error) throw error
      return data as LeaseData[]
    }
  })

  const { data: paymentPeriods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ["payment-periods", selectedLeaseId],
    queryFn: async () => {
      if (!selectedLeaseId) return []

      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", selectedLeaseId)
        .eq("status", "pending")
        .order("start_date", { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!selectedLeaseId
  })

  return {
    leases,
    isLoadingLeases,
    paymentPeriods,
    isLoadingPeriods,
    selectedLeaseId,
    setSelectedLeaseId,
    isSubmitting,
    setIsSubmitting
  }
}