import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UserRole } from "@/types/profile"
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits"
import { Profile } from "./types"

interface UseAddProfileHandlerProps {
  onSuccess?: () => void
  onClose?: () => void
  agencyId?: string
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: UseAddProfileHandlerProps) {
  const { toast } = useToast()
  const { checkLimitReached } = useSubscriptionLimits(agencyId || '')
  const [newProfile, setNewProfile] = useState<Profile>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "user" as UserRole,
  })

  const handleCreateAuthUser = async () => {
    try {
      const limitReached = await checkLimitReached('user')
      if (limitReached) {
        toast({
          title: "Erreur",
          description: "Limite d'utilisateurs atteinte pour votre plan",
          variant: "destructive",
        })
        throw new Error("Limite d'utilisateurs atteinte pour votre plan")
      }

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

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }
      
      console.log("Auth user created:", data.user?.id)
      return data.user?.id
    } catch (error: any) {
      console.error('Error creating auth user:', error)
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
          status: 'active'
        })
        .eq("id", userId)

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      onSuccess?.()
      onClose?.()
    } catch (error: any) {
      throw error
    }
  }

  return {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile,
  }
}