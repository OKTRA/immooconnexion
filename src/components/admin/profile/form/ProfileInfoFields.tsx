import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Profile } from "../types"

interface ProfileInfoFieldsProps {
  form: UseFormReturn<any>
  formData: Profile
  onFormDataChange: (data: Partial<Profile>) => void
}

export function ProfileInfoFields({
  form,
  formData,
  onFormDataChange
}: ProfileInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Prénom"
                onChange={(e) => {
                  field.onChange(e)
                  onFormDataChange({ first_name: e.target.value })
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nom"
                onChange={(e) => {
                  field.onChange(e)
                  onFormDataChange({ last_name: e.target.value })
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Téléphone"
                onChange={(e) => {
                  field.onChange(e)
                  onFormDataChange({ phone_number: e.target.value })
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}