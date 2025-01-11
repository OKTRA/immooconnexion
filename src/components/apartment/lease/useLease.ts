import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData, PaymentFrequency, DurationType, LeaseStatus, PaymentType } from "./types"

export function useLease(unitId: string, tenantId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<LeaseFormData>({
    tenant_id: tenantId || '',
    unit_id: unitId,
    start_date: "",
    end_date: "",
    rent_amount: 0,
    deposit_amount: 0,
    payment_frequency: "monthly",
    duration_type: "fixed",
    status: "active",
    payment_type: "upfront",
    deposit_returned: false,
    deposit_return_date: "",
    deposit_return_amount: "",
    deposit_return_notes: ""
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

      const endDate = formData.duration_type === "fixed" ? formData.end_date : null

      const { data: lease, error: leaseError } = await supabase
        .from('apartment_leases')
        .insert({
          tenant_id: tenantId,
          unit_id: unitId,
          start_date: formData.start_date,
          end_date: endDate,
          rent_amount: formData.rent_amount,
          deposit_amount: formData.deposit_amount,
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          status: formData.status,
          deposit_returned: formData.deposit_returned,
          deposit_return_date: formData.deposit_return_date || null,
          deposit_return_amount: formData.deposit_return_amount ? parseInt(formData.deposit_return_amount) : null,
          deposit_return_notes: formData.deposit_return_notes || null,
          agency_id: profile.agency_id,
          payment_type: formData.payment_type,
          initial_fees_paid: false
        })
        .select()
        .single()

      if (leaseError) {
        console.error('Supabase error:', leaseError)
        throw leaseError
      }

      // Create initial payment records if upfront payment
      if (formData.payment_type === "upfront") {
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