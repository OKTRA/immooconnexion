import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodSelectorProps {
  periods: number;
  maxPeriods: number;
  periodLabel: string;
  rentAmount: number;
  onPeriodsChange: (periods: number) => void;
}

export function PeriodSelector({
  periods,
  maxPeriods,
  periodLabel,
  rentAmount,
  onPeriodsChange
}: PeriodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Nombre de {periodLabel}</Label>
      <Select
        value={periods.toString()}
        onValueChange={(value) => onPeriodsChange(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionner le nombre de ${periodLabel}`} />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: maxPeriods }, (_, i) => i + 1).map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {periodLabel} ({(num * rentAmount).toLocaleString()} FCFA)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}