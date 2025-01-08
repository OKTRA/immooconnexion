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

      const { error } = await supabase
        .from('apartment_leases')
        .insert([{
          tenant_id: tenantId,
          unit_id: unitId,
          start_date: formData.startDate,
          end_date: formData.endDate,
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
        }])

      if (error) throw error

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