import { useState } from "react"
import { ProfilesTable } from "./profile/ProfilesTable"
import { ProfileSearch } from "./profile/ProfileSearch"
import { AddProfileButton } from "./profile/AddProfileButton"
import { useProfiles } from "./profile/useProfiles"
import { AddProfileDialog } from "./profile/AddProfileDialog"
import { useAddProfileHandler } from "./profile/AddProfileHandler"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: profiles = [], refetch } = useProfiles()
  const { toast } = useToast()
  
  const { newProfile, setNewProfile, handleAddUser } = useAddProfileHandler({
    onSuccess: refetch,
    onClose: () => setShowAddDialog(false)
  })

  const handleEditProfile = async (editedProfile: any) => {
    try {
      const { error } = await supabase
        .from("local_admins")
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
        handleAddUser={handleAddUser}
      />
    </div>
  )
}