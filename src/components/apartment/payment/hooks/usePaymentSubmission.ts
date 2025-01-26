import { supabase } from "@/lib/supabase"
import { PaymentFormData, LeaseData } from "../types"
import { toast } from "@/components/ui/use-toast"

export async function submitPayment(
  data: PaymentFormData,
  lease: LeaseData,
  periodsCount: number,
  agencyId: string
) {
  try {
    // Insert the payment record
    const { error: paymentError } = await supabase
      .from("apartment_lease_payments")
      .insert({
        lease_id: lease.id,
        amount: data.amount,
        payment_date: data.paymentDate,
        due_date: data.paymentDate,
        status: 'paid',
        payment_method: data.paymentMethod,
        agency_id: agencyId,
        payment_type: 'rent',
        payment_notes: data.notes,
        payment_period_start: lease.start_date,
        payment_period_end: lease.end_date,
        historical_entry: data.isHistorical,
        payment_status_type: data.isHistorical ? 'historical' : 'paid'
      })

    if (paymentError) throw paymentError

    // Update the payment periods status
    const { error: periodsError } = await supabase
      .from("apartment_payment_periods")
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .in('id', data.paymentPeriods)

    if (periodsError) throw periodsError

    toast({
      title: "Paiement enregistré",
      description: `Paiement de ${data.amount} FCFA enregistré avec succès`,
    })

    return true
  } catch (error: any) {
    console.error("Error submitting payment:", error)
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement du paiement",
      variant: "destructive",
    })
    return false
  }
}