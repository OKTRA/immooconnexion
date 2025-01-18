import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { westafrikanCountries } from "@/utils/countryUtils"

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>
  owners: Array<{
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }>
}

export function BasicInfoFields({ form, owners }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="owner_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Propriétaire</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un propriétaire" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.first_name} {owner.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'appartement</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Résidence Les Palmiers" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}