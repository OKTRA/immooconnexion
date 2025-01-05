import { ProfileForm } from "../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AuthSettingsTabProps {
  profile: any
  onProfileUpdate: () => void
}

export function AuthSettingsTab({ profile, onProfileUpdate }: AuthSettingsTabProps) {
  const { toast } = useToast()

  const handleProfileUpdate = async (userId: string) => {
    try {
      // Call the parent's onProfileUpdate after successful update
      onProfileUpdate()
      return Promise.resolve()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive"
      })
      return Promise.reject(error)
    }
  }

  return (
    <ProfileForm
      newProfile={profile}
      isEditing={true}
      onUpdateProfile={handleProfileUpdate}
    />
  )
}