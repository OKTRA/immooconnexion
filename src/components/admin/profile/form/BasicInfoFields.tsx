import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { ProfileFormData } from "../types"

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>
  onProfileChange: (updatedProfile: Partial<ProfileFormData>) => void
  isEditing?: boolean
  step?: number
  selectedAgencyId?: string
  newProfile?: ProfileFormData
}

export function BasicInfoFields({
  form,
  onProfileChange,
  isEditing = false,
  step = 1,
  selectedAgencyId,
  newProfile
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
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
                      onProfileChange({ email: e.target.value })
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
                        onProfileChange({ password: e.target.value })
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </>
      )}

      {step === 2 && (
        <>
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
                      onProfileChange({ first_name: e.target.value })
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
                      onProfileChange({ last_name: e.target.value })
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
                      onProfileChange({ phone_number: e.target.value })
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )
}