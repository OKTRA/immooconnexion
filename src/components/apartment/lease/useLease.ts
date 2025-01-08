import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LeaseFormData } from "./types"

export function useLease(unitId: string, tenantId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<LeaseFormData>({
    startDate: "",
    endDate: "",
    rentAmount: "",
    depositAmount: "",
    paymentFrequency: "monthly",
    durationType: "fixed",
    status: "active",
    depositReturned: false,
    depositReturnAmount: "",
    depositReturnDate: "",
    depositReturnNotes: "",
    paymentType: "upfront"
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

      // Si le type de durée n'est pas "fixed", la date de fin est null
      const endDate = formData.durationType === "fixed" ? formData.endDate : null

      const leaseData = {
        tenant_id: tenantId,
        unit_id: unitId,
        start_date: formData.startDate,
        end_date: endDate,
        rent_amount: parseInt(formData.rentAmount),
        deposit_amount: parseInt(formData.depositAmount),
        payment_frequency: formData.paymentFrequency,
        duration_type: formData.durationType,
        status: formData.status,
        deposit_returned: formData.depositReturned,
        deposit_return_date: formData.depositReturnDate || null,
        deposit_return_amount: formData.depositReturnAmount ? parseInt(formData.depositReturnAmount) : null,
        deposit_return_notes: formData.depositReturnNotes || null,
        agency_id: profile.agency_id,
        payment_type: formData.paymentType,
        initial_fees_paid: false
      }

      console.log('Submitting lease data:', leaseData)

      const { error } = await supabase
        .from('apartment_leases')
        .insert([leaseData])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Create initial payment records if upfront payment
      if (formData.paymentType === "upfront") {
        // Create deposit payment
        const { error: depositError } = await supabase
          .from('apartment_lease_payments')
          .insert([{
            lease_id: leaseData.id,
            amount: leaseData.deposit_amount,
            due_date: leaseData.start_date,
            status: 'pending',
            agency_id: profile.agency_id,
            payment_method: 'cash'
          }])

        if (depositError) throw depositError

        // Create first rent payment
        const { error: rentError } = await supabase
          .from('apartment_lease_payments')
          .insert([{
            lease_id: leaseData.id,
            amount: leaseData.rent_amount,
            due_date: leaseData.start_date,
            status: 'pending',
            agency_id: profile.agency_id,
            payment_method: 'cash'
          }])

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