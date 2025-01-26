import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { LeaseFormData } from "../types"

export function useSimpleLease(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<LeaseFormData>({
    tenant_id: "",
    unit_id: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "month_to_month",
    payment_type: "upfront",
    status: "active"
  })

  const createLease = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

      // Create lease
      const { data: lease, error: leaseError } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id,
          start_date: data.start_date,
          end_date: data.end_date || null,
          rent_amount: data.rent_amount,
          deposit_amount: data.deposit_amount,
          payment_frequency: data.payment_frequency,
          duration_type: data.duration_type,
          payment_type: data.payment_type,
          agency_id: userProfile.agency_id,
          status: data.status
        })
        .select()
        .single()

      if (leaseError) throw leaseError

      // Update unit status
      const { error: unitError } = await supabase
        .from('apartment_units')
        .update({ status: 'occupied' })
        .eq('id', data.unit_id)

      if (unitError) throw unitError

      // Create tenant_units association
      const { error: tenantUnitError } = await supabase
        .from('tenant_units')
        .insert({
          tenant_id: data.tenant_id,
          unit_id: data.unit_id
        })

      if (tenantUnitError) throw tenantUnitError

      return lease
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès",
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du bail",
        variant: "destructive",
      })
    }
  })

  return {
    formData,
    setFormData,
    createLease
  }
}