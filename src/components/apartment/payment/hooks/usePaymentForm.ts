import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { LeaseData } from "../types"

export function usePaymentForm(onSuccess?: () => void) {
  const [selectedLeaseId, setSelectedLeaseId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      const { data, error } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery({
    queryKey: ["leases", profile?.agency_id],
    queryFn: async () => {
      if (!profile?.agency_id) return []

      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          id,
          rent_amount,
          tenant_id,
          unit_id,
          payment_frequency,
          deposit_amount,
          initial_payments_completed,
          apartment_tenants!apartment_leases_tenant_id_fkey (
            first_name,
            last_name
          ),
          apartment_units!apartment_leases_unit_id_fkey (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("agency_id", profile.agency_id)
        .eq("status", "active")

      if (error) throw error
      
      return data.map(lease => ({
        ...lease,
        apartment_tenants: lease.apartment_tenants,
        apartment_units: lease.apartment_units
      })) as LeaseData[]
    },
    enabled: !!profile?.agency_id
  })

  return {
    leases,
    isLoadingLeases,
    selectedLeaseId,
    setSelectedLeaseId,
    isSubmitting,
    setIsSubmitting,
    agencyId: profile?.agency_id
  }
}