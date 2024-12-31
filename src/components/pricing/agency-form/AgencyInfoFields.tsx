import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SignupFormData } from "../types"

interface AgencyInfoFieldsProps {
  form: UseFormReturn<SignupFormData>
}

export function AgencyInfoFields({ form }: AgencyInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Informations de l'agence</h3>
      <p className="text-sm text-gray-500">
        Ces informations seront utilisées pour créer votre agence.
      </p>
      
      <FormField
        control={form.control}
        name="agency_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'agence</FormLabel>
            <FormControl>
              <Input placeholder="Mon Agence Immobilière" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agency_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="123 Rue Principale" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays</FormLabel>
              <FormControl>
                <Input placeholder="Côte d'Ivoire" {...field} />
              </FormControl>
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
                <Input placeholder="Abidjan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="agency_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone de l'agence</FormLabel>
            <FormControl>
              <Input placeholder="+225 XX XX XX XX XX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}