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
  email: string
  first_name: string
  last_name: string
  phone_number: string
  password: string
  agency_id: string
  role: UserRole
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

  const validateProfile = () => {
    if (!newProfile.email || !newProfile.password || !newProfile.first_name || 
        !newProfile.last_name || !newProfile.phone_number || !newProfile.agency_id) {
      throw new Error("Tous les champs sont obligatoires")
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(newProfile.email)) {
      throw new Error("Format d'email invalide")
    }

    if (newProfile.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères")
    }

    const phoneRegex = /^\+?[0-9\s-]{10,}$/
    if (!phoneRegex.test(newProfile.phone_number)) {
      throw new Error("Format de numéro de téléphone invalide")
    }
  }

  const handleAddUser = async () => {
    try {
      console.log("Starting user creation with:", newProfile)
      validateProfile()

      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newProfile.email)
        .maybeSingle()

      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà")
      }

      console.log("Creating new user...")
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newProfile.email,
        password: newProfile.password,
        options: {
          data: {
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            role: newProfile.role,
            agency_id: newProfile.agency_id,
            phone_number: newProfile.phone_number
          }
        }
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création de l'utilisateur")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email: newProfile.email,
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