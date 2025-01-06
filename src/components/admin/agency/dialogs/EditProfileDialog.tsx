import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { ProfileForm } from "../../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { EditProfileDialogProps } from "../types"
import { ProfileFormData } from "@/types/profile"

export function EditProfileDialog({ 
  open, 
  onOpenChange, 
  userId, 
  agencyId,
  onSuccess 
}: EditProfileDialogProps) {
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && userId) {
      loadProfileData()
    }
  }, [open, userId])

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      
      if (data) {
        const profileFormData: ProfileFormData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          role: data.role,
          agency_id: data.agency_id,
          is_tenant: data.is_tenant,
          status: data.status,
          has_seen_warning: data.has_seen_warning
        }
        setProfileData(profileFormData)
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de l'utilisateur",
        variant: "destructive",
      })
      onOpenChange(false)
    }
  }

  const handleUpdateProfile = async (userId: string) => {
    try {
      if (!profileData) return

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          role: profileData.role,
        })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Modifier le profil</h2>
          {profileData && (
            <ProfileForm
              isEditing={true}
              newProfile={profileData}
              setNewProfile={setProfileData}
              onUpdateProfile={handleUpdateProfile}
              selectedAgencyId={agencyId}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}