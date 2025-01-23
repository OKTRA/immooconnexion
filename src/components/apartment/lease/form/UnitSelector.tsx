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
import { Unit } from "../types"

interface UnitSelectorProps {
  form: UseFormReturn<{
    unit_id: string;
    [key: string]: any;
  }>;
  units?: Unit[];
  isLoading?: boolean;
}

export function UnitSelector({ form, units = [], isLoading }: UnitSelectorProps) {
  console.log("UnitSelector - Current form value:", form.getValues("unit_id"))
  console.log("UnitSelector - Available units:", units)

  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  const availableUnits = units.filter(unit => unit.status === 'available')
  console.log("UnitSelector - Filtered available units:", availableUnits)

  if (availableUnits.length === 0) {
    return <div>Aucune unité disponible</div>
  }

  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => {
        console.log("UnitSelector - Current field value:", field.value)
        return (
          <FormItem>
            <FormLabel>Unité</FormLabel>
            <Select 
              onValueChange={(value) => {
                console.log("UnitSelector - Value selected:", value)
                field.onChange(value)
                const selectedUnit = availableUnits.find(unit => unit.id === value)
                if (selectedUnit) {
                  console.log("UnitSelector - Updating form with unit:", selectedUnit)
                  form.setValue('rent_amount', selectedUnit.rent_amount)
                  form.setValue('deposit_amount', selectedUnit.deposit_amount || 0)
                }
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une unité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.apartment?.name} - Unité {unit.unit_number} ({unit.rent_amount.toLocaleString()} FCFA)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}