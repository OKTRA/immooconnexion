import { useState, useEffect } from "react"
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

    // Enhanced email validation using a more comprehensive regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const cleanEmail = newProfile.email.trim().toLowerCase()
    if (!emailRegex.test(cleanEmail)) {
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

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà")
      }

      // Create auth user with just email and password
      console.log("Creating auth user...")
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: newProfile.password,
        options: {
          data: {
            email: cleanEmail
          }
        }
      })

      if (authError) {
        console.error("Auth error:", authError)
        // Handle specific error cases
        if (authError.message.includes('rate limit') || authError.status === 429) {
          throw new Error("Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.")
        }
        if (authError.message.includes('invalid')) {
          throw new Error("L'adresse email fournie n'est pas valide")
        }
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création de l'utilisateur")
      }

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