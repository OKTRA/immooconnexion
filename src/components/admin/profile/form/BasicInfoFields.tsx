import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Profile } from "../types"

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>
  onProfileChange: (updatedProfile: Partial<Profile>) => void
  isEditing?: boolean
  selectedAgencyId?: string
  newProfile?: Profile
  showPasswordField?: boolean
}

export function BasicInfoFields({
  form,
  onProfileChange,
  isEditing,
  newProfile,
  showPasswordField = false
}: BasicInfoFieldsProps) {
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
                value={newProfile?.email || ''}
                onChange={(e) => {
                  field.onChange(e)
                  onProfileChange({ email: e.target.value })
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showPasswordField && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={isEditing ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                  value={newProfile?.password || ''}
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
                value={newProfile?.first_name || ''}
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
                value={newProfile?.last_name || ''}
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
                value={newProfile?.phone_number || ''}
                onChange={(e) => {
                  field.onChange(e)
                  onProfileChange({ phone_number: e.target.value })
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}