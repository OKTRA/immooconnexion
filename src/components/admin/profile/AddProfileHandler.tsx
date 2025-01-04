import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface UseAddProfileHandlerProps {
  onSuccess?: () => void
  onClose?: () => void
  agencyId?: string
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: UseAddProfileHandlerProps) {
  const { toast } = useToast()
  const [newProfile, setNewProfile] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "user",
  })

  const handleCreateAuthUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newProfile.email,
        password: newProfile.password,
        options: {
          data: {
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
          }
        }
      })

      if (error) throw error
      return data.user?.id
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateProfile = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          role: newProfile.role,
          agency_id: agencyId,
        })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été créé avec succès",
      })

      onSuccess?.()
      onClose?.()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile,
  }
}