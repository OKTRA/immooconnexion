import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password?: string;
  role?: string;
}

interface BasicInfoFieldsProps {
  newProfile: Partial<Profile>;
  onProfileChange: (profile: Partial<Profile>) => void;
  isEditing?: boolean;
}

export function BasicInfoFields({ 
  newProfile = {},
  onProfileChange,
  isEditing = false 
}: BasicInfoFieldsProps) {
  const handleChange = (field: keyof Profile, value: string) => {
    console.log("Field change:", field, value)
    onProfileChange({
      ...newProfile,
      [field]: value
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newProfile?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={newProfile?.first_name || ''}
          onChange={(e) => handleChange('first_name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          value={newProfile?.last_name || ''}
          onChange={(e) => handleChange('last_name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Numéro de téléphone</Label>
        <Input
          id="phone_number"
          value={newProfile?.phone_number || ''}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select 
          value={newProfile?.role || 'user'} 
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!isEditing && (
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={newProfile?.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            placeholder="Entrez un mot de passe"
          />
        </div>
      )}
    </div>
  )
}