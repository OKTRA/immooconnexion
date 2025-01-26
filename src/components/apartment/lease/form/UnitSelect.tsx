import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApartmentUnit } from "@/types/apartment"

interface UnitSelectProps {
  value: string
  onChange: (value: string) => void
  units: ApartmentUnit[]
}

export function UnitSelect({ value, onChange, units }: UnitSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner une unité" />
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.apartment?.name} - Unité {unit.unit_number} ({unit.rent_amount.toLocaleString()} FCFA)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}