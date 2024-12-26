import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface UseAgencyUserEditProps {
  onSuccess?: () => void
}

export function useAgencyUserEdit({ onSuccess }: UseAgencyUserEditProps = {}) {
  const { toast } = useToast()
  const [editStep, setEditStep] = useState<1 | 2>(1)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleUpdateAuth = async (user: any) => {
    try {
      console.log("Updating auth user:", user)
      
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const cleanEmail = user.email.trim().toLowerCase()
      
      if (!emailRegex.test(cleanEmail)) {
        throw new Error("Format d'email invalide")
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: cleanEmail,
        password: user.password || undefined,
      })

      if (updateError) {
        console.error("Error updating auth user:", updateError)
        throw updateError
      }

      toast({
        title: "Succès",
        description: "Les informations d'authentification ont été mises à jour",
      })

      if (onSuccess) {
        onSuccess()
      }
      setShowEditDialog(false)
    } catch (error: any) {
      console.error("Error updating auth user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour des informations d'authentification",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateProfile = async (user: any) => {
    try {
      console.log("Updating profile:", user)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          role: user.role,
        })
        .eq('id', user.id)

      if (profileError) {
        console.error("Error updating profile:", profileError)
        throw profileError
      }

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour",
      })

      if (onSuccess) {
        onSuccess()
      }
      setShowEditDialog(false)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  return {
    editStep,
    setEditStep,
    showEditDialog,
    setShowEditDialog,
    selectedUser,
    setSelectedUser,
    handleUpdateAuth,
    handleUpdateProfile,
    handleEdit
  }
}