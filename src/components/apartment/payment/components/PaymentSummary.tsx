import { Card } from "@/components/ui/card"
import { PaymentSummary as PaymentSummaryType } from "../types"
import { formatDate } from "@/lib/utils"

interface PaymentSummaryProps {
  summary: PaymentSummaryType;
  includesPenalties?: boolean;
}

export function PaymentSummary({ summary, includesPenalties = true }: PaymentSummaryProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Récapitulatif du paiement</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Loyer</span>
          <span>{summary.rentAmount.toLocaleString()} FCFA</span>
        </div>

        {includesPenalties && summary.penaltiesAmount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Pénalités</span>
            <span>{summary.penaltiesAmount.toLocaleString()} FCFA</span>
          </div>
        )}

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{summary.totalAmount.toLocaleString()} FCFA</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Périodes sélectionnées :</h4>
          {summary.selectedPeriods.map((period) => (
            <div key={period.id} className="text-sm text-gray-600">
              {formatDate(period.startDate)} - {formatDate(period.endDate)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}