import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AddProfileHandlerProps {
  onSuccess: () => void;
  onClose: () => void;
  agencyId?: string;
}

export function useAddProfileHandler({ onSuccess, onClose, agencyId }: AddProfileHandlerProps) {
  const [newProfile, setNewProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    agency_id: agencyId || "",
  })
  const { toast } = useToast()

  const handleAddUser = async () => {
    try {
      // Validation
      if (!newProfile.password) {
        toast({
          title: "Erreur",
          description: "Le mot de passe est obligatoire",
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

      // Verify the agency exists
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id')
        .eq('id', newProfile.agency_id)
        .single()

      if (agencyError || !agency) {
        throw new Error("L'agence spécifiée n'existe pas")
      }

      // Update or create the profile with all required fields
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          first_name: newProfile.first_name || 'User',
          last_name: newProfile.last_name || 'Name',
          phone_number: newProfile.phone_number || '0000000000',
          email: newProfile.email,
          agency_id: newProfile.agency_id,
          role: 'user'
        })

      if (profileError) throw profileError

      toast({
        title: existingUser ? "Profil mis à jour" : "Profil ajouté",
        description: existingUser 
          ? "Le profil a été mis à jour avec succès."
          : "Le nouveau profil a été ajouté avec succès.",
      })
      
      onClose()
      setNewProfile({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        agency_id: agencyId || "",
      })
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