import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelect } from "./components/PaymentMethodSelect"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

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
        <Card className="p-4">
          <Label className="mb-2 block">Périodes de paiement</Label>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <div className="p-4 space-y-2">
              {periods.map((period) => (
                <div 
                  key={period.id} 
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedPeriods.includes(period.id)}
                      onCheckedChange={() => {
                        if (selectedPeriods.includes(period.id)) {
                          setSelectedPeriods(selectedPeriods.filter(id => id !== period.id))
                        } else {
                          setSelectedPeriods([...selectedPeriods, period.id])
                        }
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(period.start_date), "d MMMM yyyy", { locale: fr })} - 
                        {format(new Date(period.end_date), "d MMMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {period.amount?.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    period.status === 'late' ? 'bg-destructive/10 text-destructive' :
                    period.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {period.status === 'late' ? 'En retard' :
                     period.status === 'pending' ? 'En attente' :
                     'À venir'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
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