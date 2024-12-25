import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UserRole } from "@/types/profile"

interface AddProfileHandlerProps {
  onSuccess: () => void
  onClose: () => void
  agencyId?: string
}

interface NewProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  agency_id: string;
  role: UserRole;
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: AddProfileHandlerProps) {
  const initialProfile: NewProfile = {
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    agency_id: agencyId || "",
    role: "user"
  }
  
  const [newProfile, setNewProfile] = useState<NewProfile>(initialProfile)
  const { toast } = useToast()

  const validateAuthData = () => {
    if (!newProfile.email || !newProfile.password) {
      throw new Error("Email et mot de passe sont obligatoires")
    }

    const cleanEmail = newProfile.email.trim().toLowerCase()
    console.log("Validating email:", cleanEmail)
    
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error("Format d'email invalide")
    }

    if (newProfile.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères")
    }

    return cleanEmail
  }

  const validateProfileData = () => {
    if (!newProfile.first_name || !newProfile.last_name || 
        !newProfile.phone_number || !newProfile.agency_id) {
      throw new Error("Tous les champs sont obligatoires")
    }

    const phoneRegex = /^\+?[0-9\s-]{10,}$/
    if (!phoneRegex.test(newProfile.phone_number)) {
      throw new Error("Format de numéro de téléphone invalide")
    }
  }

  const handleCreateAuthUser = async () => {
    try {
      const cleanEmail = validateAuthData()
      console.log("Creating auth user with email:", cleanEmail)

      // Check if user exists in profiles table first
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (profileError) {
        console.error("Profile check error:", profileError)
        throw new Error("Erreur lors de la vérification du profil")
      }

      if (existingProfile) {
        throw new Error("Un utilisateur avec cet email existe déjà")
      }

      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: newProfile.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email: cleanEmail,
          }
        }
      })

      if (authError) {
        console.error("Auth error:", authError)
        
        if (authError.message.includes('rate limit') || authError.status === 429) {
          throw new Error("Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.")
        }
        throw new Error(authError.message || "Erreur lors de la création de l'utilisateur")
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création de l'utilisateur")
      }

      // Sign out immediately to prevent session conflicts
      await supabase.auth.signOut()

      console.log("Auth user created successfully:", authData.user.id)
      return authData.user.id
    } catch (error: any) {
      console.error('Error in handleCreateAuthUser:', error)
      throw error
    }
  }

  const handleUpdateProfile = async (userId: string) => {
    try {
      validateProfileData()

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: newProfile.email.trim().toLowerCase(),
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          role: newProfile.role,
          agency_id: newProfile.agency_id
        })

      if (profileError) {
        console.error("Profile error:", profileError)
        throw profileError
      }

      toast({
        title: "Succès",
        description: "Le profil a été créé avec succès.",
      })
      
      onClose()
      setNewProfile(initialProfile)
      onSuccess()
    } catch (error: any) {
      console.error('Error in handleUpdateProfile:', error)
      throw error
    }
  }

  return {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile
  }
}