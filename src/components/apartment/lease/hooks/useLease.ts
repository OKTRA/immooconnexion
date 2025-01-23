import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData, SplitLeaseFormData } from "../types"

interface UseLeaseProps {
  initialUnitId?: string
  tenantId: string
  onSuccess: () => void
  isSplitLease?: boolean
}

export function useLease({ initialUnitId, tenantId, onSuccess, isSplitLease }: UseLeaseProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialFormData: SplitLeaseFormData = {
    unit_id: initialUnitId || "",
    start_date: new Date().toISOString().split('T')[0],
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "month_to_month",
    payment_type: "upfront",
    split_type: "A"
  }

  const [formData, setFormData] = useState<SplitLeaseFormData>(initialFormData)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert([{
          tenant_id: tenantId,
          unit_id: formData.unit_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          rent_amount: formData.rent_amount,
          deposit_amount: formData.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          payment_type: formData.payment_type,
          agency_id: profile.agency_id,
          ...(isSplitLease && { split_type: formData.split_type })
        }])

      if (leaseError) throw leaseError

      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting
  }
}