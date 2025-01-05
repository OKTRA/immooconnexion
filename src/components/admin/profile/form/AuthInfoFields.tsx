import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Profile } from "../types"

interface AuthInfoFieldsProps {
  form: UseFormReturn<any>
  formData: Profile
  onFormDataChange: (data: Partial<Profile>) => void
  isEditing?: boolean
}

export function AuthInfoFields({
  form,
  formData,
  onFormDataChange,
  isEditing
}: AuthInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  field.onChange(e)
                  onFormDataChange({ email: e.target.value })
                }}
                disabled={isEditing}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {!isEditing && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Mot de passe"
                  onChange={(e) => {
                    field.onChange(e)
                    onFormDataChange({ password: e.target.value })
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  )
}