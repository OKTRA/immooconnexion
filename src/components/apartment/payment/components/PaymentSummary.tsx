import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentSummary as PaymentSummaryType } from "../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PaymentSummaryProps {
  summary: PaymentSummaryType;
  className?: string;
}

export function PaymentSummary({ summary, className }: PaymentSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Récapitulatif du paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Loyer</span>
            <span className="font-medium">{summary.rentAmount.toLocaleString()} FCFA</span>
          </div>
          
          {summary.penaltiesAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pénalités</span>
              <span className="font-medium text-destructive">
                {summary.penaltiesAmount.toLocaleString()} FCFA
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nombre de périodes</span>
            <span className="font-medium">{summary.periodsCount}</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">
                {summary.totalAmount.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}