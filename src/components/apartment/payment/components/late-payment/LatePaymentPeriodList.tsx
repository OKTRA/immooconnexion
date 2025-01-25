import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentPeriod } from "@/types/payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LatePaymentPeriodListProps {
  periods: PaymentPeriod[]
  selectedPeriods: string[]
  onPeriodSelect: (periodId: string) => void
}

export function LatePaymentPeriodList({ 
  periods, 
  selectedPeriods, 
  onPeriodSelect 
}: LatePaymentPeriodListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Périodes en retard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
              onClick={() => onPeriodSelect(period.id)}
            >
              <div>
                <p className="font-medium">
                  {format(new Date(period.startDate), "d MMMM yyyy", { locale: fr })} - {" "}
                  {format(new Date(period.endDate), "d MMMM yyyy", { locale: fr })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {period.amount.toLocaleString()} FCFA
                </p>
              </div>
              <Badge variant={selectedPeriods.includes(period.id) ? "default" : "outline"}>
                {selectedPeriods.includes(period.id) ? "Sélectionné" : "Non sélectionné"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}