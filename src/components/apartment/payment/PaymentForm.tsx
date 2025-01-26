import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentPeriodSelector } from "./components/PaymentPeriodSelector"
import { PaymentFormData, LeaseData } from "./types"
import { submitPayment } from "./hooks/usePaymentSubmission"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

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
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  const { data: periods = [] } = useQuery({
    queryKey: ["lease-periods", leaseId],
    queryFn: async () => {
      console.log("Fetching payment periods for lease:", leaseId)
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", leaseId)
        .order("start_date", { ascending: true })

      if (error) {
        console.error("Error fetching periods:", error)
        throw error
      }
      console.log("Fetched periods:", data)
      return data
    }
  })

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: lease.rent_amount, // Utiliser le montant du loyer du bail
      paymentMethod: 'cash',
      paymentDate: paymentDate,
      paymentPeriods: [],
      notes: '',
      isHistorical: isHistorical,
      type: 'rent'
    }
  })

  // Calculer le montant total basé sur le nombre de périodes sélectionnées
  const totalAmount = selectedPeriods.length * lease.rent_amount

  useEffect(() => {
    setValue('amount', totalAmount > 0 ? totalAmount : lease.rent_amount)
    setValue('paymentPeriods', selectedPeriods)
    setValue('paymentDate', paymentDate)
  }, [totalAmount, selectedPeriods, paymentDate, setValue, lease.rent_amount])

  const onSubmit = async (data: PaymentFormData) => {
    if (!lease) return
    await submitPayment(data, lease, selectedPeriods.length, lease.agency_id)
    onSuccess?.()
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
        periods={periods}
        selectedPeriods={selectedPeriods}
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