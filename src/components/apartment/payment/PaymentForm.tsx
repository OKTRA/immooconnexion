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
import { Euro } from "lucide-react"

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
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", leaseId)
        .order("start_date", { ascending: true })

      if (error) throw error
      return data
    }
  })

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: lease.rent_amount,
      paymentMethod: 'cash',
      paymentDate: paymentDate,
      paymentPeriods: [],
      notes: '',
      isHistorical: isHistorical,
      type: 'rent'
    }
  })

  const totalAmount = selectedPeriods.reduce((sum, periodId) => {
    const period = periods.find(p => p.id === periodId)
    return sum + (period?.amount || 0)
  }, 0)

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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Résumé du paiement */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Loyer mensuel</span>
              <span className="font-semibold">{lease.rent_amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nombre de périodes</span>
              <span className="font-semibold">{selectedPeriods.length || 1}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="text-base font-medium">Montant total</span>
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                <span className="text-lg font-bold">
                  {(totalAmount || lease.rent_amount).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Sélecteur de périodes */}
        <PaymentPeriodSelector
          periods={periods}
          selectedPeriods={selectedPeriods}
          onPeriodsChange={setSelectedPeriods}
          totalAmount={totalAmount}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
        </div>

        <div className="space-y-4">
          <div>
            <Label>Notes</Label>
            <Input
              {...register('notes')}
              className="mt-1"
              placeholder="Ajouter des notes sur le paiement..."
            />
          </div>

          <Button type="submit" className="w-full">
            Enregistrer le paiement
          </Button>
        </div>
      </div>
    </form>
  )
}