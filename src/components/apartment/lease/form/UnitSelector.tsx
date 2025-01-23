import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"

interface Unit {
  id: string;
  unit_number: string;
  rent_amount: number;
  status?: string;
  apartment: {
    id: string;
    name: string;
  };
}

interface UnitSelectorProps {
  form: UseFormReturn<{
    unit_id: string;
    [key: string]: any;
  }>;
  units: Unit[];
  isLoading?: boolean;
}

export function UnitSelector({ form, units = [], isLoading }: UnitSelectorProps) {
  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  // Filter to only show available units
  const availableUnits = units.filter(unit => unit.status === 'available')

  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unité</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableUnits.length === 0 ? (
                <SelectItem value="no-units" disabled>
                  Aucune unité disponible
                </SelectItem>
              ) : (
                availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.apartment.name} - Unité {unit.unit_number} ({unit.rent_amount.toLocaleString()} FCFA)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export type { Unit };