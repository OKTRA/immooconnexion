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
    agency_id: agencyId || "",
  })
  const { toast } = useToast()

  const handleAddUser = async () => {
    try {
      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newProfile.email)
        .maybeSingle()

      if (existingProfile) {
        toast({
          title: "Erreur",
          description: "Un profil avec cet email existe déjà",
          variant: "destructive",
        })
        return
      }

      // Créer le nouvel utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newProfile.email,
        password: 'tempPassword123!', // Mot de passe temporaire
        options: {
          data: {
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
          }
        }
      })

      if (authError) throw authError

      // Le trigger handle_new_user s'occupera de créer le profil
      // Mais on met à jour les champs supplémentaires
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            phone_number: newProfile.phone_number,
            agency_id: newProfile.agency_id,
            role: 'user'
          })
          .eq('id', authData.user.id)

        if (updateError) throw updateError
      }

      toast({
        title: "Profil ajouté",
        description: "Le nouveau profil a été ajouté avec succès. Un email de confirmation a été envoyé.",
      })
      
      onClose()
      setNewProfile({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        agency_id: agencyId || "",
      })
      onSuccess()
    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
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