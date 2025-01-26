import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentFormProps, PaymentFormData, LeaseData } from "./types"
import { submitPayment } from "./hooks/usePaymentSubmission"

export function PaymentForm({ 
  onSuccess, 
  leaseId,
  lease,
  isHistorical = false
}: PaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: 0,
      paymentMethod: 'cash',
      paymentDate: paymentDate,
      paymentPeriods: [],
      notes: '',
      isHistorical: isHistorical
    }
  })

  const { data: periods = [] } = useQuery({
    queryKey: ["lease-periods", leaseId],
    queryFn: async () => {
      console.log("Fetching payment periods for lease:", leaseId)
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("status", "pending")
        .order("start_date", { ascending: true })

      if (error) {
        console.error("Error fetching periods:", error)
        throw error
      }
      console.log("Fetched periods:", data)
      return data
    },
    enabled: !!leaseId
  })

  useEffect(() => {
    if (lease && selectedPeriods.length > 0) {
      const totalAmount = selectedPeriods.length * lease.rent_amount
      console.log("Calculating total amount:", totalAmount, "for periods:", selectedPeriods.length)
      setValue('amount', totalAmount)
      setValue('paymentPeriods', selectedPeriods)
      setValue('paymentDate', paymentDate)
    }
  }, [lease, selectedPeriods, paymentDate, setValue])

  const onSubmit = async (data: PaymentFormData) => {
    if (!lease) return
    console.log("Submitting payment:", data)
    await submitPayment(data, lease, selectedPeriods.length, lease.agency_id)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Montant</Label>
        <Input
          type="number"
          {...register('amount')}
          className="mt-1"
        />
      </div>

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
        Enregistrer le paiement
      </Button>
    </form>
  )
}