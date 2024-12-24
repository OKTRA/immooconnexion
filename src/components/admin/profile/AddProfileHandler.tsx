import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AddProfileHandlerProps {
  onSuccess: () => void;
  onClose: () => void;
  agencyId?: string;
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: AddProfileHandlerProps) {
  const initialProfile = {
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    agency_id: agencyId || "",
    role: "user"
  }
  
  const [newProfile, setNewProfile] = useState(initialProfile)
  const { toast } = useToast()

  const handleAddUser = async () => {
    try {
      // Validation
      if (!newProfile.email || !newProfile.password) {
        toast({
          title: "Erreur",
          description: "L'email et le mot de passe sont obligatoires",
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

      let userId

      if (existingUser) {
        userId = existingUser.id
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newProfile.email,
          password: newProfile.password,
        })

        if (authError) throw authError
        if (!authData.user) throw new Error("Aucun utilisateur créé")
        
        userId = authData.user.id
      }

      // Update or create the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          first_name: newProfile.first_name || 'User',
          last_name: newProfile.last_name || 'Name',
          phone_number: newProfile.phone_number || '0000000000',
          email: newProfile.email,
          agency_id: newProfile.agency_id,
          role: newProfile.role
        })

      if (profileError) throw profileError

      toast({
        title: existingUser ? "Profil mis à jour" : "Profil ajouté",
        description: existingUser 
          ? "Le profil a été mis à jour avec succès."
          : "Le nouveau profil a été ajouté avec succès.",
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