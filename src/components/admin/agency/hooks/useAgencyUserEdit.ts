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
        // Check for existing email
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

        // Update email using standard auth API
        const { error: updateError } = await supabase.auth.updateUser({
          email: editedUser.email,
        })

        if (updateError) throw updateError
      }

      // If password is provided, validate and update it
      if (editedUser.password) {
        if (editedUser.password.length < 6) {
          toast({
            title: "Erreur",
            description: "Le mot de passe doit contenir au moins 6 caractères",
            variant: "destructive",
          })
          return
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: editedUser.password
        })

        if (passwordError) throw passwordError
      }

      setSelectedUser(editedUser)
      setEditStep(2)

      toast({
        title: "Succès",
        description: "Les informations d'authentification ont été mises à jour",
      })
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