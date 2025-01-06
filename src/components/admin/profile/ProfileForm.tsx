import { ProfileFormData, UserRole } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ProfileFormProps {
  newProfile: ProfileFormData;
  setNewProfile: (profile: ProfileFormData) => void;
  onSuccess: () => Promise<void>;
  isEditing?: boolean;
}

export function ProfileForm({
  newProfile,
  setNewProfile,
  onSuccess,
  isEditing = false,
}: ProfileFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newProfile.email || ""}
          onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
          required
          disabled={isEditing}
        />
      </div>

      {!isEditing && (
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={newProfile.password || ""}
            onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
            required={!isEditing}
          />
        </div>
      )}

      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          type="text"
          value={newProfile.first_name || ""}
          onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          type="text"
          value={newProfile.last_name || ""}
          onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          type="text"
          value={newProfile.phone_number || ""}
          onChange={(e) => setNewProfile({ ...newProfile, phone_number: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select
          value={newProfile.role}
          onValueChange={(value) => setNewProfile({ ...newProfile, role: value as UserRole })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="super_admin">Super Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">
        {isEditing ? "Modifier le profil" : "Ajouter un profil"}
      </Button>
    </form>
  );
}