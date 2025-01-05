import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function useAgencyUserEdit({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editStep, setEditStep] = useState<1 | 2>(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  const handleUpdateAuth = async (user: any) => {
    try {
      // Instead of using admin endpoints, update the profile table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          email: user.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

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
    }
  }

  const handleUpdateProfile = async (user: any) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          role: user.role,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour",
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
    setEditStep(1)
    setShowEditDialog(true)
  }

  return {
    showEditDialog,
    setShowEditDialog,
    editStep,
    setEditStep,
    selectedUser,
    setSelectedUser,
    handleUpdateAuth,
    handleUpdateProfile,
    handleEdit,
  }
}