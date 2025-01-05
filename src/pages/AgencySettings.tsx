import { useState } from "react"
import { AddProfileDialog } from "@/components/admin/profile/AddProfileDialog"
import { useProfiles } from "@/hooks/useProfiles"
import { useAgencies } from "@/hooks/useAgencies"

export default function AgencySettings() {
  const [isAddProfileDialogOpen, setIsAddProfileDialogOpen] = useState(false)
  const { profiles, refetchProfiles } = useProfiles()
  const { agencyId } = useAgencies()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Paramètres de l'agence</h1>
      <button
        onClick={() => setIsAddProfileDialogOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Ajouter un utilisateur
      </button>
      <div className="grid grid-cols-1 gap-4">
        {profiles.map(profile => (
          <div key={profile.id} className="p-4 border rounded">
            <h2 className="text-xl">{profile.first_name} {profile.last_name}</h2>
            <p>Email: {profile.email}</p>
            <p>Téléphone: {profile.phone_number}</p>
            <p>Rôle: {profile.role}</p>
          </div>
        ))}
      </div>
      <AddProfileDialog
        open={isAddProfileDialogOpen}
        onOpenChange={setIsAddProfileDialogOpen}
        newProfile={{
          id: "",
          email: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          role: "user",
        }}
        setNewProfile={() => {}}
        handleCreateAuthUser={async () => ""}
        handleUpdateProfile={async () => {}}
        agencyId={agencyId}
        onProfileCreated={refetchProfiles}
      />
    </div>
  )
}
