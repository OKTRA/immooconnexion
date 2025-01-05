import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/types/profile"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { BasicInfoFieldsProps } from "../types"

export function BasicInfoFields({ 
  newProfile = {},
  onProfileChange,
  isEditing = false,
  step = 1,
  selectedAgencyId,
  form
}: BasicInfoFieldsProps) {
  const handleChange = (field: keyof typeof newProfile, value: string) => {
    onProfileChange({ [field]: value })
  }

  const { data: agency } = useQuery({
    queryKey: ["agency", selectedAgencyId],
    queryFn: async () => {
      if (!selectedAgencyId) return null
      const { data, error } = await supabase
        .from("agencies")
        .select("name")
        .eq("id", selectedAgencyId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!selectedAgencyId
  })

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={newProfile?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            {isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe*"}
          </Label>
          <Input
            id="password"
            type="password"
            value={newProfile?.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            required={!isEditing}
            placeholder="Minimum 6 caractères"
            minLength={6}
          />
          <p className="text-sm text-gray-500">
            {isEditing 
              ? "Laissez vide pour conserver le mot de passe actuel. Si modifié, doit contenir au moins 6 caractères."
              : "Le mot de passe doit contenir au moins 6 caractères"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedAgencyId && (
        <div>
          <Label htmlFor="agency_name">Agence</Label>
          <Input
            id="agency_name"
            value={agency?.name || ''}
            readOnly
            className="bg-gray-100"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">Prénom*</Label>
          <Input
            id="first_name"
            value={newProfile?.first_name || ''}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
            placeholder="Jean"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Nom*</Label>
          <Input
            id="last_name"
            value={newProfile?.last_name || ''}
            onChange={(e) => handleChange('last_name', e.target.value)}
            required
            placeholder="Dupont"
          />
        </div>
        <div>
          <Label htmlFor="phone_number">Numéro de téléphone*</Label>
          <Input
            id="phone_number"
            value={newProfile?.phone_number || ''}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            required
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle*</Label>
          <Select 
            value={newProfile?.role || 'user'} 
            onValueChange={(value: UserRole) => handleChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Agent immobilier</SelectItem>
              <SelectItem value="admin">Administrateur d'agence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
