import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentPeriod } from "@/types/payment"

interface LatePaymentSummaryProps {
  periods: PaymentPeriod[]
  penalties: number
}

export function LatePaymentSummary({ periods, penalties }: LatePaymentSummaryProps) {
  const baseAmount = periods.reduce((sum, period) => sum + period.amount, 0)
  const totalAmount = baseAmount + penalties

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé du paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Montant de base</span>
            <span>{baseAmount.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-destructive">
            <span>Pénalités de retard</span>
            <span>{penalties.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total à payer</span>
            <span>{totalAmount.toLocaleString()} FCFA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}