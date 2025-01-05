import { ProfileForm } from "../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AuthSettingsTabProps {
  profile: any
  onProfileUpdate: () => void
}

export function AuthSettingsTab({ profile, onProfileUpdate }: AuthSettingsTabProps) {
  const { toast } = useToast()

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
      throw error // Re-throw to be handled by the form
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