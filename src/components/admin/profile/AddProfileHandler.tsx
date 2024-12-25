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

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddUser = async () => {
    try {
      console.log("Starting user creation with:", newProfile)

      // Comprehensive validation
      if (!newProfile.email || !newProfile.password) {
        toast({
          title: "Erreur",
          description: "L'email et le mot de passe sont obligatoires",
          variant: "destructive",
        })
        return
      }

      // Email validation
      if (!isValidEmail(newProfile.email)) {
        toast({
          title: "Email invalide",
          description: "Veuillez entrer une adresse email valide",
          variant: "destructive",
        })
        return
      }

      if (!newProfile.agency_id) {
        toast({
          title: "Erreur",
          description: "L'agence est obligatoire",
          variant: "destructive",
        })
        return
      }

      if (newProfile.password.length < 6) {
        toast({
          title: "Erreur",
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive",
        })
        return
      }

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
        // Create the user with email and password
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
        description: "Le profil a été créé avec succès",
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