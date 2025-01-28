import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PeriodSelectorProps {
  periods: number
  maxPeriods: number
  periodLabel: string
  rentAmount: number
  onPeriodsChange: (value: number) => void
}

export function PeriodSelector({ 
  periods,
  maxPeriods,
  periodLabel,
  rentAmount,
  onPeriodsChange
}: PeriodSelectorProps) {
  const totalAmount = rentAmount * periods

  return (
    <div className="space-y-2">
      <Label>Nombre de {periodLabel}</Label>
      <Select value={periods.toString()} onValueChange={(value) => onPeriodsChange(parseInt(value))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: maxPeriods }, (_, i) => i + 1).map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {periodLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Montant par période : {rentAmount.toLocaleString()} FCFA
      </p>
    </div>
  )
}