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
    status: "pending",
    payment_type: "upfront",
    deposit_returned: false,
    deposit_return_date: "",
    deposit_return_amount: "",
    deposit_return_notes: "",
    agency_fees_percentage: 50,
    commission_percentage: 10,
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

      // Calculer les montants
      const agencyFees = (formData.rent_amount * formData.agency_fees_percentage) / 100
      const commission = (formData.rent_amount * formData.commission_percentage) / 100

      // Create the lease
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

      // Créer les paiements initiaux (caution et frais d'agence) dans tous les cas
      const initialPayments = [
        // Paiement de la caution
        {
          lease_id: lease.id,
          amount: lease.deposit_amount,
          due_date: lease.start_date,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'deposit'
        },
        // Frais d'agence
        {
          lease_id: lease.id,
          amount: agencyFees,
          due_date: lease.start_date,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'agency_fees'
        },
        // Commission
        {
          lease_id: lease.id,
          amount: commission,
          due_date: lease.start_date,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'commission',
          commission_percentage: formData.commission_percentage
        }
      ]

      // Si paiement d'avance, ajouter le premier loyer
      if (formData.payment_type === "upfront") {
        initialPayments.push({
          lease_id: lease.id,
          amount: lease.rent_amount,
          due_date: lease.start_date,
          status: 'pending',
          agency_id: profile.agency_id,
          payment_method: 'cash',
          type: 'rent'
        })
      }

      const { error: paymentsError } = await supabase
        .from('apartment_lease_payments')
        .insert(initialPayments)

      if (paymentsError) throw paymentsError

      toast({
        title: "Contrat créé",
        description: formData.payment_type === "upfront" 
          ? "Le contrat de location et tous les paiements initiaux ont été créés avec succès"
          : "Le contrat de location, la caution et les frais d'agence ont été créés avec succès",
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