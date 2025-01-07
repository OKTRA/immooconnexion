import { ProfileFormData, UserRole } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileFormProps {
  newProfile: ProfileFormData
  setNewProfile: (profile: ProfileFormData) => void
  onSuccess?: () => void
  isEditing?: boolean
  selectedAgencyId?: string
}

export function ProfileForm({
  newProfile,
  setNewProfile,
  onSuccess,
  isEditing = false,
  selectedAgencyId,
}: ProfileFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newProfile.email || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, email: e.target.value })
            }
            required
          />
        </div>

        {!isEditing && (
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={newProfile.password || ""}
              onChange={(e) =>
                setNewProfile({ ...newProfile, password: e.target.value })
              }
              required={!isEditing}
            />
          </div>
        )}

        <div>
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={newProfile.first_name || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, first_name: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={newProfile.last_name || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, last_name: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="phone_number">Téléphone</Label>
          <Input
            id="phone_number"
            value={newProfile.phone_number || ""}
            onChange={(e) =>
              setNewProfile({ ...newProfile, phone_number: e.target.value })
            }
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
              {!selectedAgencyId && (
                <SelectItem value="super_admin">Super Admin</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">
          {isEditing ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}