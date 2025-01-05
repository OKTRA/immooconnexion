import { ProfileForm } from "../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "../profile/types"
import { useState } from "react"

interface AuthSettingsTabProps {
  profile: Profile;
  onProfileUpdate: () => void;
}

export function AuthSettingsTab({ profile, onProfileUpdate }: AuthSettingsTabProps) {
  const { toast } = useToast()
  const [editedProfile, setEditedProfile] = useState<Profile>(profile)

  const handleProfileUpdate = async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      // Call the parent's onProfileUpdate after successful update
      onProfileUpdate()
      
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive"
      })
      throw error
    }
  }

  return (
    <ProfileForm
      newProfile={editedProfile}
      setNewProfile={setEditedProfile}
      isEditing={true}
      onUpdateProfile={handleProfileUpdate}
    />
  )
}