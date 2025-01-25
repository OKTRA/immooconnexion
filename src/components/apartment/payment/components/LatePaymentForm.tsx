import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { PaymentPeriod, PaymentMethod, PaymentSummary } from "../types/payment"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface LatePaymentFormProps {
  leaseId: string;
  onSuccess?: () => void;
}

export function LatePaymentForm({ leaseId, onSuccess }: LatePaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [includePenalties, setIncludePenalties] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: periods = [], isLoading } = useQuery({
    queryKey: ["late-payment-periods", leaseId],
    queryFn: async () => {
      const { data: periods, error } = await supabase
        .from("apartment_payment_periods")
        .select(`
          *,
          payment_period_penalties (
            id,
            amount,
            days_late,
            status
          )
        `)
        .eq("lease_id", leaseId)
        .in("status", ["late", "pending"])
        .order("start_date", { ascending: true })

      if (error) throw error
      return periods as PaymentPeriod[]
    }
  })

  const calculateSummary = (): PaymentSummary => {
    const selectedPeriodData = periods.filter(p => selectedPeriods.includes(p.id))
    const baseAmount = selectedPeriodData.reduce((sum, p) => sum + p.amount, 0)
    const penaltiesAmount = includePenalties ? selectedPeriodData.reduce((sum, p) => {
      return sum + (p.penalties?.[0]?.amount || 0)
    }, 0) : 0

    return {
      baseAmount,
      penaltiesAmount,
      totalAmount: baseAmount + penaltiesAmount,
      periodsCount: selectedPeriodData.length
    }
  }

  const handleSubmit = async () => {
    if (selectedPeriods.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une période",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const summary = calculateSummary()
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: summary.totalAmount,
          payment_method: paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          payment_type: "late_payment",
          payment_period_start: periods.find(p => p.id === selectedPeriods[0])?.start_date,
          payment_period_end: periods.find(p => p.id === selectedPeriods[selectedPeriods.length - 1])?.end_date
        })

      if (paymentError) throw paymentError

      // Update period statuses
      const { error: updateError } = await supabase
        .from("apartment_payment_periods")
        .update({ status: "paid" })
        .in("id", selectedPeriods)

      if (updateError) throw updateError

      if (includePenalties) {
        // Update penalty statuses
        const { error: penaltyError } = await supabase
          .from("payment_period_penalties")
          .update({ status: "paid" })
          .in("payment_period_id", selectedPeriods)

        if (penaltyError) throw penaltyError
      }

      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès"
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const summary = calculateSummary()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Périodes en retard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periods.map((period) => {
              const penalty = period.penalties?.[0]
              return (
                <div key={period.id} className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedPeriods.includes(period.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPeriods([...selectedPeriods, period.id])
                      } else {
                        setSelectedPeriods(selectedPeriods.filter(id => id !== period.id))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {format(new Date(period.start_date), "d MMMM yyyy", { locale: fr })} - {format(new Date(period.end_date), "d MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Montant: {period.amount.toLocaleString()} FCFA
                      {penalty && (
                        <span className="ml-2 text-red-500">
                          + {penalty.amount.toLocaleString()} FCFA (Pénalité)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-sm">
                    {period.status === "late" ? (
                      <span className="text-red-500">En retard</span>
                    ) : (
                      <span className="text-yellow-500">En attente</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé du paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Montant de base</span>
              <span>{summary.baseAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={includePenalties}
                  onCheckedChange={(checked) => setIncludePenalties(!!checked)}
                />
                <span>Inclure les pénalités</span>
              </div>
              <span>{summary.penaltiesAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{summary.totalAmount.toLocaleString()} FCFA</span>
            </div>

            <PaymentMethodSelect
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value)}
            />

            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || selectedPeriods.length === 0}
              className="w-full"
            >
              {isSubmitting ? "Traitement..." : "Effectuer le paiement"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}