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

interface UnitSelectorProps {
  form: UseFormReturn<any>
  units?: {
    id: string
    unit_number: string
    rent_amount: number
    status?: string
    apartment: {
      id: string
      name: string
    }
  }[]
  isLoading?: boolean
}

export function UnitSelector({ form, units = [], isLoading }: UnitSelectorProps) {
  // Filter to only show available units
  const availableUnits = units.filter(unit => unit.status === 'available')

  if (!form) {
    console.error("Form object is missing in UnitSelector")
    return null
  }

  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unité</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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