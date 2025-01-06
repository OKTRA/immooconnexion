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
      <div>
        <label htmlFor="agency_id">ID de l'agence</label>
        <input
          id="agency_id"
          type="text"
          value={newProfile.agency_id || ""}
          onChange={(e) => setNewProfile({ ...newProfile, agency_id: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="is_tenant">Est locataire</label>
        <input
          id="is_tenant"
          type="checkbox"
          checked={newProfile.is_tenant}
          onChange={(e) => setNewProfile({ ...newProfile, is_tenant: e.target.checked })}
        />
      </div>
      <div>
        <label htmlFor="status">Statut</label>
        <input
          id="status"
          type="text"
          value={newProfile.status}
          onChange={(e) => setNewProfile({ ...newProfile, status: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="has_seen_warning">A vu l'avertissement</label>
        <input
          id="has_seen_warning"
          type="checkbox"
          checked={newProfile.has_seen_warning}
          onChange={(e) => setNewProfile({ ...newProfile, has_seen_warning: e.target.checked })}
        />
      </div>
      {isEditing && (
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
          />
        </div>
      )}
      <button type="submit">{isEditing ? "Modifier le profil" : "Ajouter un profil"}</button>
    </form>
  );
}
