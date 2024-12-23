import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
}

export function ProfileForm({ newProfile, setNewProfile }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={newProfile.email}
          onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={newProfile.first_name}
          onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          value={newProfile.last_name}
          onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Numéro de téléphone</Label>
        <Input
          id="phone_number"
          value={newProfile.phone_number}
          onChange={(e) => setNewProfile({ ...newProfile, phone_number: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="agency_name">Nom de l'agence</Label>
        <Input
          id="agency_name"
          value={newProfile.agency_name}
          onChange={(e) => setNewProfile({ ...newProfile, agency_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select
          value={newProfile.role}
          onValueChange={(value) => setNewProfile({ ...newProfile, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show_phone"
          checked={newProfile.show_phone_on_site}
          onCheckedChange={(checked) => 
            setNewProfile({ ...newProfile, show_phone_on_site: checked })
          }
        />
        <Label htmlFor="show_phone">Afficher le numéro sur le site</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="list_properties"
          checked={newProfile.list_properties_on_site}
          onCheckedChange={(checked) => 
            setNewProfile({ ...newProfile, list_properties_on_site: checked })
          }
        />
        <Label htmlFor="list_properties">Lister les propriétés sur le site</Label>
      </div>
    </div>
  );
}