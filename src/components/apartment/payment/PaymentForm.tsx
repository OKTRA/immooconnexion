import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
import { PaymentFormProps, PaymentFormData } from "./types"
import { submitPayment } from "./hooks/usePaymentSubmission"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  const handlePeriodToggle = (periodId: string) => {
    setSelectedPeriods(prev => 
      prev.includes(periodId) 
        ? prev.filter(id => id !== periodId)
        : [...prev, periodId]
    )
  }

  const onSubmit = async (data: PaymentFormData) => {
    if (!lease) return
    console.log("Submitting payment:", data)
    await submitPayment(data, lease, selectedPeriods.length, lease.agency_id)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label>Montant du loyer mensuel</Label>
              <div className="text-2xl font-bold">{lease?.rent_amount?.toLocaleString()} FCFA</div>
            </div>

            <div className="space-y-2">
              <Label>Périodes de paiement</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <div className="p-4 space-y-2">
                  {periods.map((period) => (
                    <div key={period.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={period.id}
                        checked={selectedPeriods.includes(period.id)}
                        onCheckedChange={() => handlePeriodToggle(period.id)}
                      />
                      <label
                        htmlFor={period.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {format(new Date(period.start_date), "d MMMM yyyy", { locale: fr })} - {format(new Date(period.end_date), "d MMMM yyyy", { locale: fr })}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-4">
              <Label>Montant total</Label>
              <Input
                type="number"
                {...register('amount')}
                className="mt-1"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

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
      </div>
    </form>
  )
}