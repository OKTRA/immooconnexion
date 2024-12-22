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
import { ExpenseFormData } from "./types"

interface PropertySelectProps {
  form: UseFormReturn<ExpenseFormData>
  properties?: any[]
  propertyId?: string
}

export function PropertySelect({ form, properties, propertyId }: PropertySelectProps) {
  if (propertyId) return null;

  return (
    <FormField
      control={form.control}
      name="propertyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Propriété</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une propriété" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {properties?.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.bien} - {property.ville}
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