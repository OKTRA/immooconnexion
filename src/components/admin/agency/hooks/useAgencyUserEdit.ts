import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function useAgencyUserEdit({ onSuccess }: { onSuccess: () => void }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editStep, setEditStep] = useState<1 | 2>(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const handleUpdateAuth = async (editedUser: any) => {
    try {
      if (editedUser.email !== selectedUser.email) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', editedUser.email)
          .single()

        if (existingUser) {
          toast({
            title: "Erreur",
            description: "Cet email est déjà utilisé",
            variant: "destructive",
          })
          return
        }
      }

      if (editedUser.password || editedUser.email !== selectedUser.email) {
        const updateData: any = {}
        if (editedUser.password) updateData.password = editedUser.password
        if (editedUser.email !== selectedUser.email) updateData.email = editedUser.email

        const { error: authError } = await supabase.auth.admin.updateUserById(
          editedUser.id,
          updateData
        )
        if (authError) throw authError
      }

      setSelectedUser(editedUser)
      setEditStep(2)
    } catch (error: any) {
      console.error("Error updating auth user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProfile = async (editedUser: any) => {
    try {
      const { password, ...profileData } = editedUser
      
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", editedUser.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })
      onSuccess()
      setShowEditDialog(false)
      setEditStep(1)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setEditStep(1)
    setShowEditDialog(true)
  }

  return {
    showEditDialog,
    setShowEditDialog,
    editStep,
    setEditStep,
    selectedUser,
    handleUpdateAuth,
    handleUpdateProfile,
    handleEdit
  }
}