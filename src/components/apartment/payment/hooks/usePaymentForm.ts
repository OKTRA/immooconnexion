import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { LeaseData } from "../types"

export function usePaymentForm(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      return userProfile
    }
  })

  const { data: leases = [], isLoading: isLoadingLeases } = useQuery({
    queryKey: ["leases", profile?.agency_id],
    queryFn: async () => {
      if (!profile?.agency_id) return []

      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:tenant_id (
            id,
            first_name,
            last_name,
            phone_number
          ),
          unit:unit_id (
            id,
            unit_number,
            apartment:apartments (
              id,
              name
            )
          )
        `)
        .eq("agency_id", profile.agency_id)

      if (error) throw error
      return data as LeaseData[]
    },
    enabled: !!profile?.agency_id
  })

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)

      const { error } = await supabase
        .from("apartment_lease_payments")
        .insert({
          ...formData,
          agency_id: profile?.agency_id,
          status: "pending"
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    handleSubmit,
    leases,
    isLoadingLeases,
    agencyId: profile?.agency_id,
    refetchLeases: () => {}
  }
}