import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SignupFormData } from "../types"

interface AdminAccountFieldsProps {
  form: UseFormReturn<SignupFormData>
}

export function AdminAccountFields({ form }: AdminAccountFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Compte administrateur</h3>
      <p className="text-sm text-gray-500">
        Ces informations seront utilisées pour créer votre compte administrateur.
        Vous pourrez vous connecter avec cet email et ce mot de passe.
      </p>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="contact@monagence.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}