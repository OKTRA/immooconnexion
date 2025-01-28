import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

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
    <>
      <div>
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
      </div>

      <div>
        <Label>Montant total</Label>
        <Input
          type="text"
          value={`${totalAmount.toLocaleString()} FCFA`}
          disabled
        />
        <p className="text-sm text-muted-foreground mt-1">
          {periods} {periodLabel} × {rentAmount.toLocaleString()} FCFA
        </p>
      </div>
    </>
  )
}