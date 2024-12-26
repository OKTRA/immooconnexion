import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ProfileFormData } from "./ProfileForm"

interface AddProfileHandlerProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const AddProfileHandler = ({ onSuccess, onError }: AddProfileHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validateAuthData = (newProfile: ProfileFormData) => {
    if (!newProfile.email?.trim()) {
      throw new Error("L'email est requis")
    }
    if (!newProfile.password?.trim()) {
      throw new Error("Le mot de passe est requis")
    }
    return newProfile.email.trim()
  }

  const validateProfileData = (newProfile: ProfileFormData) => {
    if (!newProfile.first_name?.trim()) {
      throw new Error("Le prénom est requis")
    }
    if (!newProfile.last_name?.trim()) {
      throw new Error("Le nom est requis")
    }
    if (!newProfile.role) {
      throw new Error("Le rôle est requis")
    }
    if (newProfile.role === "admin" && !newProfile.agency_id) {
      throw new Error("L'agence est requise pour un administrateur")
    }
  }

  const handleCreateAuthUser = async (newProfile: ProfileFormData): Promise<string> => {
    try {
      const cleanEmail = validateAuthData(newProfile)
      console.log("Creating auth user with email:", cleanEmail)

      // Create new user directly without checking existing
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: newProfile.password,
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

  const handleSubmit = async (newProfile: ProfileFormData) => {
    setIsLoading(true)

    try {
      validateProfileData(newProfile)
      
      const userId = await handleCreateAuthUser(newProfile)

      // Update profile with additional info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: newProfile.first_name?.trim(),
          last_name: newProfile.last_name?.trim(),
          role: newProfile.role,
          agency_id: newProfile.agency_id,
          phone_number: newProfile.phone_number?.trim(),
        })
        .eq("id", userId)

      if (profileError) {
        console.error("Profile error:", profileError)
        throw new Error(profileError.message || "Erreur lors de la mise à jour du profil")
      }

      // If user is admin, create administrator record
      if (newProfile.role === "admin") {
        const { error: adminError } = await supabase
          .from("administrators")
          .insert({
            id: userId,
            agency_id: newProfile.agency_id,
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
    handleSubmit,
    isLoading,
  }
}