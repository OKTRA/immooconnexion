import { useState } from "react"
import { ProfilesTable } from "./ProfilesTable"
import { ProfileSearch } from "./ProfileSearch"
import { AddProfileButton } from "./AddProfileButton"
import { useProfiles } from "./useProfiles"
import { AddProfileDialog } from "./AddProfileDialog"
import { useAddProfileHandler } from "./AddProfileHandler"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: profiles = [], refetch } = useProfiles()
  const { toast } = useToast()
  
  const { newProfile, setNewProfile, handleCreateAuthUser, handleUpdateProfile } = useAddProfileHandler({
    onSuccess: refetch,
    onClose: () => setShowAddDialog(false)
  })

  const handleEditProfile = async (editedProfile: any) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          email: editedProfile.email,
          phone_number: editedProfile.phone_number,
        })
        .eq("id", editedProfile.id)

      if (error) throw error

      toast({
        title: "Profil mis à jour",
        description: "Le profil a été mis à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      })
    }
  }

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
        onEdit={handleEditProfile}
      />

      <AddProfileDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleUpdateProfile}
      />
    </div>
  )
}

export default AdminProfiles