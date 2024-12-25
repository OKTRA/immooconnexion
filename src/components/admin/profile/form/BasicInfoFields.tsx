import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Lock, UserCog } from "lucide-react"

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password?: string;
  role?: UserRole;
  agency_id?: string;
}

interface BasicInfoFieldsProps {
  newProfile: Partial<Profile>;
  onProfileChange: (profile: Partial<Profile>) => void;
  isEditing?: boolean;
  step?: 1 | 2;
  selectedAgencyId?: string;
  onUpdateAuth?: () => void;
  onUpdateProfile?: () => void;
}

export function BasicInfoFields({ 
  newProfile = {},
  onProfileChange,
  isEditing = false,
  step = 1,
  selectedAgencyId,
  onUpdateAuth,
  onUpdateProfile
}: BasicInfoFieldsProps) {
  const handleChange = (field: keyof Profile, value: string) => {
    onProfileChange({ [field]: value })
  }

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
        <div>
          <Label htmlFor="password">Mot de passe*</Label>
          <Input
            id="password"
            type="password"
            value={newProfile?.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            required={!isEditing}
            placeholder="Minimum 6 caractères"
            minLength={6}
          />
        </div>
        {isEditing && (
          <Button 
            type="button" 
            className="w-full"
            onClick={onUpdateAuth}
          >
            <Lock className="w-4 h-4 mr-2" />
            Mettre à jour les informations d'authentification
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
      {isEditing && (
        <Button 
          type="button" 
          className="w-full"
          onClick={onUpdateProfile}
        >
          <UserCog className="w-4 h-4 mr-2" />
          Mettre à jour les informations du profil
        </Button>
      )}
    </div>
  )
}