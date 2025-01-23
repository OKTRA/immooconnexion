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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface UnitSelectorProps {
  form: UseFormReturn<{
    unit_id: string;
    rent_amount: number;
    deposit_amount: number;
    [key: string]: any;
  }>;
  units?: any[];
  isLoading?: boolean;
}

export function UnitSelector({ form, units = [], isLoading }: UnitSelectorProps) {
  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  const availableUnits = units.filter(unit => unit.status === 'available')

  if (availableUnits.length === 0) {
    return <div>Aucune unité disponible</div>
  }

  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unité</FormLabel>
          <Select 
            onValueChange={(value) => {
              const selectedUnit = availableUnits.find(unit => unit.id === value)
              if (selectedUnit) {
                // Mettre à jour les montants dans le formulaire
                form.setValue('unit_id', value)
                form.setValue('rent_amount', selectedUnit.rent_amount)
                form.setValue('deposit_amount', selectedUnit.deposit_amount || selectedUnit.rent_amount)
                
                // Log pour debug
                console.log('Selected unit:', selectedUnit)
                console.log('Updated form values:', form.getValues())
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
      )}
    />
  )
}