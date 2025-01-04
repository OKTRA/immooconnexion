import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface UseAgencyUserEditProps {
  onSuccess?: () => void
}

export function useAgencyUserEdit({ onSuccess }: UseAgencyUserEditProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editStep, setEditStep] = useState(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const handleUpdateAuth = async (email: string, password?: string) => {
    try {
      if (password && password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères")
      }

      const updateData: any = { email }
      if (password && password.length >= 6) {
        updateData.password = password
      }

      const { error } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        updateData
      )

      if (error) throw error

      toast({
        title: "Succès",
        description: "Les informations d'authentification ont été mises à jour",
      })

      setEditStep(2)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", selectedUser.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })

      onSuccess?.()
      setShowEditDialog(false)
      setEditStep(1)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
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
    handleEdit,
  }
}