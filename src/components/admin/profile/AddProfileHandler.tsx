import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ProfileFormData } from "./types"
import { UserRole } from "@/types/profile"

interface UseAddProfileHandlerProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
  onClose?: () => void
  agencyId?: string
}

export function useAddProfileHandler({ onSuccess, onError, onClose, agencyId }: UseAddProfileHandlerProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [newProfile, setNewProfile] = useState<ProfileFormData>({})
  const { toast } = useToast()

  const validateAuthData = (profile: ProfileFormData) => {
    if (!profile.email?.trim()) {
      throw new Error("L'email est requis")
    }
    if (!profile.password?.trim()) {
      throw new Error("Le mot de passe est requis")
    }
    return profile.email.trim()
  }

  const validateProfileData = (profile: ProfileFormData) => {
    if (!profile.first_name?.trim()) {
      throw new Error("Le prénom est requis")
    }
    if (!profile.last_name?.trim()) {
      throw new Error("Le nom est requis")
    }
    if (!profile.role) {
      throw new Error("Le rôle est requis")
    }
    if (profile.role === "admin" && !profile.agency_id) {
      throw new Error("L'agence est requise pour un administrateur")
    }
  }

  const handleCreateAuthUser = async (): Promise<string> => {
    try {
      const cleanEmail = validateAuthData(newProfile)
      console.log("Creating auth user with email:", cleanEmail)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: newProfile.password!,
        options: {
          data: {
            role: newProfile.role,
          },
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(authError.message === "User already registered" 
          ? "Un utilisateur avec cet email existe déjà"
          : authError.message || "Erreur lors de la création de l'utilisateur")
      }

      if (!authData.user?.id) {
        throw new Error("Aucun ID utilisateur retourné")
      }

      return authData.user.id
    } catch (error: any) {
      console.error("Error in handleCreateAuthUser:", error)
      throw error
    }
  }

  const handleUpdateProfile = async (userId: string) => {
    try {
      validateProfileData(newProfile)
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: newProfile.first_name?.trim(),
          last_name: newProfile.last_name?.trim(),
          role: newProfile.role as UserRole,
          agency_id: agencyId || newProfile.agency_id,
          phone_number: newProfile.phone_number?.trim(),
        })
        .eq("id", userId)

      if (profileError) {
        console.error("Profile error:", profileError)
        throw new Error(profileError.message || "Erreur lors de la mise à jour du profil")
      }

      if (newProfile.role === "admin") {
        const { error: adminError } = await supabase
          .from("administrators")
          .insert({
            id: userId,
            agency_id: agencyId || newProfile.agency_id,
            is_super_admin: false,
          })

        if (adminError) {
          console.error("Admin error:", adminError)
          throw new Error(adminError.message || "Erreur lors de la création de l'administrateur")
        }
      }

      toast({
        title: "Succès",
        description: "Le profil a été créé avec succès",
      })

      onSuccess?.()
      onClose?.()
    } catch (error: any) {
      console.error("Form submission error:", error)
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })

      onError?.(error)
    } finally {
      setIsLoading(false)
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