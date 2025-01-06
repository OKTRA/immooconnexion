import { ProfileFormData } from "@/types/profile";

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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={newProfile.email}
          onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="first_name">Prénom</label>
        <input
          id="first_name"
          type="text"
          value={newProfile.first_name || ""}
          onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="last_name">Nom</label>
        <input
          id="last_name"
          type="text"
          value={newProfile.last_name || ""}
          onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="phone_number">Numéro de téléphone</label>
        <input
          id="phone_number"
          type="text"
          value={newProfile.phone_number || ""}
          onChange={(e) => setNewProfile({ ...newProfile, phone_number: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="role">Rôle</label>
        <select
          id="role"
          value={newProfile.role}
          onChange={(e) => setNewProfile({ ...newProfile, role: e.target.value as any })}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
          <option value="super_admin">Super Administrateur</option>
        </select>
      </div>
      {!isEditing && (
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
          />
        </div>
      )}
      <button type="submit">
        {isEditing ? "Modifier le profil" : "Ajouter un profil"}
      </button>
    </form>
  );
}