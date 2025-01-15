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

      console.log("Fetching leases with agency_id:", profile.agency_id)

      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          id,
          rent_amount,
          tenant_id,
          unit_id,
          payment_frequency,
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
        .eq("agency_id", profile.agency_id)
        .eq("status", "active")

      if (error) {
        console.error("Error fetching leases:", error)
        throw error
      }

      console.log("Fetched leases:", data)
      
      return data.map(lease => ({
        id: lease.id,
        rent_amount: lease.rent_amount,
        tenant_id: lease.tenant_id,
        unit_id: lease.unit_id,
        payment_frequency: lease.payment_frequency,
        apartment_tenants: {
          first_name: lease.apartment_tenants?.first_name,
          last_name: lease.apartment_tenants?.last_name
        },
        apartment_units: {
          unit_number: lease.apartment_units?.unit_number,
          apartment: {
            name: lease.apartment_units?.apartment?.name
          }
        }
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