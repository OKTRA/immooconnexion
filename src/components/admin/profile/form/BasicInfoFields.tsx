import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AgencySelect } from "./AgencySelect"
import { AgencyLogoUpload } from "./AgencyLogoUpload"

interface Profile {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password?: string;
  agency_id?: string;
}

interface BasicInfoFieldsProps {
  newProfile?: Profile;
  setNewProfile: (profile: Profile) => void;
}

export function BasicInfoFields({ newProfile = {}, setNewProfile }: BasicInfoFieldsProps) {
  const handleChange = (field: keyof Profile, value: string) => {
    if (typeof setNewProfile === 'function') {
      setNewProfile({ ...newProfile, [field]: value });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
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
        />
      </div>
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
      
      <AgencySelect 
        value={newProfile?.agency_id || ''} 
        onChange={(value) => handleChange('agency_id', value)}
      />
      
      <AgencyLogoUpload agencyId={newProfile?.agency_id} />
    </div>
  )
}