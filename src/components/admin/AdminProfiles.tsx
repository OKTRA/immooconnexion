import { useState } from "react"
import { ProfilesTable } from "./profile/ProfilesTable"
import { ProfileSearch } from "./profile/ProfileSearch"
import { AddProfileButton } from "./profile/AddProfileButton"
import { useProfiles } from "./profile/useProfiles"
import { AddProfileDialog } from "./profile/AddProfileDialog"
import { useAddProfileHandler } from "./profile/AddProfileHandler"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: profiles = [], refetch } = useProfiles()
  
  const { newProfile, setNewProfile, handleAddUser } = useAddProfileHandler({
    onSuccess: refetch,
    onClose: () => setShowAddDialog(false)
  })

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ProfileSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AddProfileButton onClick={() => setShowAddDialog(true)} />
      </div>
      
      <ProfilesTable 
        profiles={filteredProfiles}
        refetch={refetch}
      />

      <AddProfileDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleAddUser={handleAddUser}
      />
    </div>
  )
}