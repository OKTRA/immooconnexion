import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UserRole } from "@/types/profile"

interface AddProfileHandlerProps {
  onSuccess: () => void;
  onClose: () => void;
  agencyId?: string;
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

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateProfile = () => {
    if (!newProfile.email || !newProfile.password || !newProfile.first_name || 
        !newProfile.last_name || !newProfile.phone_number || !newProfile.agency_id) {
      throw new Error("Tous les champs sont obligatoires")
    }

    if (!isValidEmail(newProfile.email)) {
      throw new Error("L'adresse email n'est pas valide")
    }

    if (newProfile.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères")
    }

    if (!newProfile.phone_number.match(/^\+?[0-9\s-]{10,}$/)) {
      throw new Error("Le numéro de téléphone n'est pas valide")
    }
  }

  const handleAddUser = async () => {
    try {
      console.log("Starting user creation with:", newProfile)
      
      validateProfile()

      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newProfile.email)
        .maybeSingle()

      let userId: string

      if (existingUser) {
        userId = existingUser.id
        console.log("Existing user found:", userId)
      } else {
        console.log("Creating new user...")
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newProfile.email,
          password: newProfile.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              role: newProfile.role,
              agency_id: newProfile.agency_id
            }
          }
        })

        if (authError) {
          console.error("Auth error:", authError)
          throw new Error(authError.message)
        }
        if (!authData.user) throw new Error("Aucun utilisateur créé")
        
        userId = authData.user.id
        console.log("New user created:", userId)
      }

      // Update or create the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          email: newProfile.email,
          agency_id: newProfile.agency_id,
          role: newProfile.role
        })

      if (profileError) {
        console.error("Profile error:", profileError)
        throw profileError
      }

      console.log("Profile created/updated successfully")

      toast({
        title: "Succès",
        description: "Le profil a été créé avec succès. Un email de confirmation a été envoyé.",
      })
      
      onClose()
      setNewProfile(initialProfile)
      onSuccess()
    } catch (error: any) {
      console.error('Error in handleAddUser:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du profil",
        variant: "destructive",
      })
    }
  }

  return {
    newProfile,
    setNewProfile,
    handleAddUser
  }
}