import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types/profile"

interface ExtendedProfile extends Profile {
  password?: string;
}

export function useAgencyUserEdit(userId: string | null, agencyId: string, onSuccess?: () => void) {
  const [newProfile, setNewProfile] = useState<ExtendedProfile>({
    id: userId || '',
    email: '',
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
  const { toast } = useToast()

  const handleCreateAuthUser = async () => {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', newProfile.email)
        .single()

      if (existingUser) {
        // If user exists, update their profile instead of creating new
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            phone_number: newProfile.phone_number,
            role: newProfile.role,
            agency_id: agencyId,
            status: 'active'
          })
          .eq('id', existingUser.id)

        if (updateError) throw updateError

        toast({
          title: "Utilisateur existant",
          description: "Le profil a été mis à jour avec succès",
        })

        return existingUser.id
      }

      // If user doesn't exist, create new user
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: newProfile.email,
        password: newProfile.password || '',
        email_confirm: true
      })

      if (signUpError) {
        let errorMessage = "Erreur lors de la création du compte"
        
        if (signUpError.message.includes("password")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères"
        } else if (signUpError.message.includes("email")) {
          errorMessage = "Veuillez entrer une adresse email valide"
        }

        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        })
        throw signUpError
      }

      if (!authData.user) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le compte utilisateur",
          variant: "destructive",
        })
        throw new Error("No user data returned")
      }

      // Create profile for new user
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

      if (profileError) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le profil utilisateur",
          variant: "destructive",
        })
        throw profileError
      }

      toast({
        title: "Succès",
        description: "Le compte a été créé avec succès",
      })

      return authData.user.id
    } catch (error: any) {
      console.error("Error creating auth user:", error)
      throw error
    }
  }

  const handleUpdateProfile = async () => {
    try {
      if (!userId) {
        toast({
          title: "Erreur",
          description: "ID utilisateur manquant",
          variant: "destructive",
        })
        return
      }

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

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive",
        })
        throw error
      }

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error updating profile:", error)
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
    handleCreateAuthUser,
    handleUpdateProfile,
  }
}