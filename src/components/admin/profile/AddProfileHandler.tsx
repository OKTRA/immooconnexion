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
  const [lastSignupAttempt, setLastSignupAttempt] = useState<number>(0)
  const { toast } = useToast()

  const validateAuthData = () => {
    if (!newProfile.email || !newProfile.password) {
      throw new Error("Email et mot de passe sont obligatoires")
    }

    // Improved email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(newProfile.email.trim())) {
      throw new Error("Format d'email invalide")
    }

    if (newProfile.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères")
    }
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
      validateAuthData()

      // Check rate limiting
      const now = Date.now()
      if (now - lastSignupAttempt < 60000) { // 1 minute delay
        throw new Error("Veuillez patienter une minute avant de réessayer")
      }
      setLastSignupAttempt(now)

      // Trim email to remove any whitespace
      const cleanEmail = newProfile.email.trim().toLowerCase()

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
        if (authError.message.includes('rate_limit')) {
          throw new Error("Trop de tentatives. Veuillez réessayer dans quelques minutes.")
        }
        console.error("Auth error:", authError)
        throw authError
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
        description: "Le profil a été créé avec succès. Un email de confirmation a été envoyé.",
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