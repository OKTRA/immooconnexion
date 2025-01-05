import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types/profile"
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits"

interface UseAddProfileHandlerProps {
  onSuccess?: () => void
  onClose?: () => void
  agencyId?: string
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: UseAddProfileHandlerProps) {
  const { toast } = useToast()
  const { checkLimitReached } = useSubscriptionLimits(agencyId || '')
  const [newProfile, setNewProfile] = useState<Profile>({
    id: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "user",
    agency_id: agencyId || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  })

  const handleCreateAuthUser = async (): Promise<void> => {
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

      // Store current session
      const { data: { session: adminSession } } = await supabase.auth.getSession()
      if (!adminSession) {
        throw new Error("No admin session found")
      }

      const { data, error } = await supabase.auth.signUp({
        email: newProfile.email,
        password: newProfile.password || '',
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

      // Restore admin session
      await supabase.auth.setSession(adminSession)
      
      console.log("Auth user created:", data.user?.id)
    } catch (error: any) {
      console.error('Error creating auth user:', error)
      throw error
    }
  }

  const handleUpdateProfile = async (userId: string): Promise<void> => {
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