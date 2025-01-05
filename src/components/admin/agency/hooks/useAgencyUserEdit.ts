import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "../../profile/types"

export function useAgencyUserEdit(userId: string | null, agencyId: string, onSuccess?: () => void) {
  const [newProfile, setNewProfile] = useState<Profile>({
    id: userId || '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'user',
    agency_id: agencyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateAuthUser = async (): Promise<void> => {
    try {
      setIsSubmitting(true)
      const { data: { session: adminSession } } = await supabase.auth.getSession()
      if (!adminSession) {
        throw new Error("No admin session found")
      }

      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: newProfile.email,
        password: newProfile.password || '',
        email_confirm: true
      })

      if (signUpError) throw signUpError

      if (!authData.user) {
        throw new Error("No user data returned")
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: newProfile.email,
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          role: newProfile.role,
          agency_id: agencyId,
          status: 'active'
        })

      if (profileError) throw profileError

      await supabase.auth.setSession(adminSession)
      
      toast({
        title: "Succès",
        description: "L'utilisateur a été créé avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error creating auth user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
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
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    newProfile,
    setNewProfile,
    isSubmitting,
    handleCreateAuthUser,
    handleUpdateProfile,
  }
}