import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "./types"
import { useToast } from "@/hooks/use-toast"

interface UseAddProfileHandlerProps {
  onSuccess?: () => void
  onClose?: () => void
  agencyId?: string
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: UseAddProfileHandlerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [newProfile, setNewProfile] = useState<Profile>({
    id: '',
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "admin",
    agency_id: agencyId || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  })

  const handleCreateAuthUser = async () => {
    setIsLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: newProfile.email,
        password: newProfile.password as string,
      })

      if (authError) throw authError

      if (!user?.id) {
        throw new Error("No user ID returned")
      }

      await handleUpdateProfile(user.id)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (onClose) {
        onClose()
      }
    }
  }

  const handleUpdateProfile = async (userId: string) => {
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          agency_id: agencyId,
          role: "admin"
        })
        .eq("id", userId)

      if (profileError) throw profileError
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    isLoading,
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile
  }
}