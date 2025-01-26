import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentPeriodSelector } from "./components/PaymentPeriodSelector"
import { PaymentFormData, LeaseData } from "./types"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"

interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  lease: LeaseData
  isHistorical?: boolean
}

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  lease,
  isHistorical = false
}: PaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState(1)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  const { data: periods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ["payment-periods", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_payment_periods')
        .select('*')
        .eq('lease_id', leaseId)
        .eq('status', 'pending')
        .order('start_date', { ascending: true })
        .limit(selectedPeriods)

      if (error) throw error
      return data
    },
    enabled: !!leaseId
  })

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: lease.rent_amount,
      paymentMethod: 'cash',
      paymentDate: paymentDate,
      paymentPeriods: [],
      notes: '',
      isHistorical: isHistorical
    }
  })

  // Calculer le montant total basé sur le nombre de périodes sélectionnées
  const totalAmount = selectedPeriods * lease.rent_amount

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (periods.length === 0) {
        throw new Error("Aucune période de paiement disponible")
      }

      const periodIds = periods.map(p => p.id)

      const { data: result, error } = await supabase.rpc(
        'handle_mixed_payment_insertion',
        {
          p_lease_id: leaseId,
          p_payment_periods: periodIds,
          p_payment_date: data.paymentDate,
          p_payment_method: data.paymentMethod,
          p_agency_id: lease.agency_id,
          p_notes: data.notes
        }
      )

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du paiement:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-2">
          <Label>Informations du bail</Label>
          <div className="text-sm space-y-1">
            <p>Locataire: {lease.tenant.first_name} {lease.tenant.last_name}</p>
            <p>Montant du loyer: {lease.rent_amount.toLocaleString()} FCFA</p>
            <p>Fréquence: {lease.payment_frequency}</p>
          </div>
        </div>
      </Card>

      <PaymentPeriodSelector
        paymentFrequency={lease.payment_frequency}
        rentAmount={lease.rent_amount}
        onPeriodsChange={setSelectedPeriods}
        totalAmount={totalAmount}
      />

      <div className="space-y-4">
        <div>
          <Label>Mode de paiement</Label>
          <PaymentMethodSelect
            value={watch('paymentMethod')}
            onChange={(value) => setValue('paymentMethod', value)}
          />
        </div>

        <div>
          <Label>Date de paiement</Label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Input
            {...register('notes')}
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full">
          Enregistrer le paiement ({totalAmount.toLocaleString()} FCFA)
        </Button>
      </div>
    </form>
  )
}