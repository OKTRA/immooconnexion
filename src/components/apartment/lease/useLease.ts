import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData, PaymentFrequency, DurationType, LeaseStatus, PaymentType } from "./types"

export function useLease(unitId: string, tenantId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<LeaseFormData>({
    startDate: "",
    endDate: "",
    rentAmount: "",
    depositAmount: "",
    paymentFrequency: "monthly" as PaymentFrequency,
    durationType: "fixed" as DurationType,
    status: "active" as LeaseStatus,
    paymentType: "upfront" as PaymentType,
    tenant_id: tenantId || "",
    unit_id: unitId,
    initial_fees_paid: false
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée à ce profil")
      }

      const endDate = formData.durationType === "fixed" ? formData.endDate : null

      const { data: lease, error: leaseError } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: tenantId,
          unit_id: unitId,
          start_date: formData.startDate,
          end_date: endDate,
          rent_amount: parseInt(formData.rentAmount),
          deposit_amount: parseInt(formData.depositAmount),
          payment_frequency: formData.paymentFrequency,
          duration_type: formData.durationType,
          status: formData.status,
          agency_id: profile.agency_id,
          payment_type: formData.paymentType,
          initial_fees_paid: false
        })
        .select()
        .single()

      if (leaseError) {
        console.error('Supabase error:', leaseError)
        throw leaseError
      }

      // Create initial payment records if upfront payment
      if (formData.paymentType === "upfront") {
        // Create deposit payment
        const { error: depositError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: lease.id,
            amount: lease.deposit_amount,
            due_date: lease.start_date,
            status: 'pending',
            agency_id: profile.agency_id,
            payment_method: 'cash'
          })

        if (depositError) throw depositError

        // Create first rent payment
        const { error: rentError } = await supabase
          .from('apartment_lease_payments')
          .insert({
            lease_id: lease.id,
            amount: lease.rent_amount,
            due_date: lease.start_date,
            status: 'pending',
            agency_id: profile.agency_id,
            payment_method: 'cash'
          })

        if (rentError) throw rentError
      }

      toast({
        title: "Contrat créé",
        description: "Le contrat de location a été créé avec succès",
      })
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du contrat",
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
    isSubmitting,
  }
}