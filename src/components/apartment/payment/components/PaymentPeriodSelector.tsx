import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentPeriod } from "@/types/payment"
import { Card } from "@/components/ui/card"

interface PaymentPeriodSelectorProps {
  periods: PaymentPeriod[]
  selectedPeriods: string[]
  onPeriodsChange: (periods: string[]) => void
  totalAmount: number
}

export function PaymentPeriodSelector({
  periods,
  selectedPeriods,
  onPeriodsChange,
  totalAmount
}: PaymentPeriodSelectorProps) {
  const handlePeriodToggle = (periodId: string) => {
    if (selectedPeriods.includes(periodId)) {
      onPeriodsChange(selectedPeriods.filter(id => id !== periodId))
    } else {
      onPeriodsChange([...selectedPeriods, periodId])
    }
  }

  return (
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
                  onCheckedChange={() => handlePeriodToggle(period.id)}
                />
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(period.startDate), "d MMMM yyyy", { locale: fr })} - 
                    {format(new Date(period.endDate), "d MMMM yyyy", { locale: fr })}
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
  )
}