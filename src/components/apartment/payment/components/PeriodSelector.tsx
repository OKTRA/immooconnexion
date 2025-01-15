import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PeriodOption } from "../types";

interface PeriodSelectorProps {
  periodOptions: PeriodOption[];
  selectedPeriods: number;
  onPeriodsChange: (value: number) => void;
}

export function PeriodSelector({
  periodOptions,
  selectedPeriods,
  onPeriodsChange,
}: PeriodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Nombre de périodes</Label>
      <Select 
        value={selectedPeriods.toString()} 
        onValueChange={(value) => onPeriodsChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le nombre de périodes" />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}