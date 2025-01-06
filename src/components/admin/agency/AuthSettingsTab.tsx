import { ProfileForm } from "../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Profile, ProfileFormData } from "@/types/profile"
import { useState } from "react"

interface AuthSettingsTabProps {
  profile: Profile
  onProfileUpdate: () => void
}

export function AuthSettingsTab({ profile, onProfileUpdate }: AuthSettingsTabProps) {
  const { toast } = useToast()
  const [editedProfile, setEditedProfile] = useState<ProfileFormData>({
    id: profile.id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone_number: profile.phone_number,
    role: profile.role,
    agency_id: profile.agency_id,
    is_tenant: profile.is_tenant,
    status: profile.status,
    has_seen_warning: profile.has_seen_warning
  })

  const handleProfileUpdate = async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

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