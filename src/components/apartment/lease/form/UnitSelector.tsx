import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

interface Unit {
  id: string;
  unit_number: string;
  rent_amount: number;
  apartment: {
    id: string;
    name: string;
  };
}

interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
  units: Unit[];
  isLoading: boolean;
}

export function UnitSelector({ value, onChange, units = [], isLoading }: UnitSelectorProps) {
  console.log("UnitSelector received units:", units)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Unité d'appartement</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="unit">Unité d'appartement</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="unit" className="w-full">
          <SelectValue placeholder="Sélectionner une unité" />
        </SelectTrigger>
        <SelectContent>
          {units.length === 0 ? (
            <SelectItem value="no-units" disabled>
              Chargement des unités...
            </SelectItem>
          ) : (
            units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.apartment?.name} - Unité {unit.unit_number} ({unit.rent_amount.toLocaleString()} FCFA)
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}