import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money"

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
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
  const [selectedLeaseId, setSelectedLeaseId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Récupérer l'ID de l'agence de l'utilisateur connecté
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      const { data, error } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery({
    queryKey: ["leases"],
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
        .order("start_date")

      if (error) throw error
      return data
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
    setIsSubmitting,
    agencyId: profile?.agency_id
  }
}