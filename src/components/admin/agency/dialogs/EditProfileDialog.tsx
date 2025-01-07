import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { ProfileForm } from "../../profile/ProfileForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { EditProfileDialogProps } from "../types"

export function EditProfileDialog({ 
  open, 
  onOpenChange, 
  userId, 
  agencyId,
  onSuccess 
}: EditProfileDialogProps) {
  const [profileData, setProfileData] = useState<any>(null)
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
      setProfileData(data)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de l'utilisateur",
        variant: "destructive",
      })
      onOpenChange(false)
    }
  }

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          email: updatedData.email,
          phone_number: updatedData.phone_number,
          role: updatedData.role,
        })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      })
      onSuccess()
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