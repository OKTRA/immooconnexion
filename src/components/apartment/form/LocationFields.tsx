import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { westafrikanCountries } from "@/utils/countryUtils"

interface LocationFieldsProps {
  form: UseFormReturn<any>
}

export function LocationFields({ form }: LocationFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pays</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le pays" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {westafrikanCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
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
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ville</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Abidjan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quartier</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Cocody" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 123 Rue de la Paix" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}