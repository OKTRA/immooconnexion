import { useState } from "react"
import { ProfilesTable } from "./profile/ProfilesTable"
import { ProfileSearch } from "./profile/ProfileSearch"
import { AddProfileButton } from "./profile/AddProfileButton"
import { useProfiles } from "./profile/useProfiles"
import { AddProfileDialog } from "./profile/AddProfileDialog"
import { useAddProfileHandler } from "./profile/AddProfileHandler"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "./profile/types"
import { supabase } from "@/integrations/supabase/client"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgency, setSelectedAgency] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: profiles = [], refetch } = useProfiles()
  const { toast } = useToast()
  
  const [newProfile, setNewProfile] = useState<Profile>({
    id: '',
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "user",
    agency_id: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  })

  const { handleCreateAuthUser, handleUpdateProfile } = useAddProfileHandler({
    onSuccess: () => {
      toast({
        title: "Profil créé",
        description: "Le profil a été créé avec succès",
      })
      refetch()
      setShowAddDialog(false)
    },
    onClose: () => setShowAddDialog(false)
  })

  const handleEditProfile = async (editedProfile: Profile) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          email: editedProfile.email,
          phone_number: editedProfile.phone_number,
          updated_at: new Date().toISOString()
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
    (profile) => {
      const matchesSearch = 
        profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAgency = selectedAgency === "all" || profile.agency_id === selectedAgency

      return matchesSearch && matchesAgency
    }
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ProfileSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          selectedAgency={selectedAgency}
          setSelectedAgency={setSelectedAgency}
        />
        <AddProfileButton onClick={() => setShowAddDialog(true)} />
      </div>
      
      <ProfilesTable 
        profiles={filteredProfiles}
        refetch={refetch}
        onEdit={handleEditProfile}
      />

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleCreateAuthUser={handleCreateAuthUser}
        handleUpdateProfile={handleUpdateProfile}
      />
    </div>
  )
}