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
      // Vérifier si l'admin existe déjà
      const { data: existingAdmin } = await supabase
        .from('local_admins')
        .select('id')
        .eq('email', newProfile.email)
        .maybeSingle()

      if (existingAdmin) {
        toast({
          title: "Erreur",
          description: "Un administrateur avec cet email existe déjà",
          variant: "destructive",
        })
        return
      }

      // Créer le nouvel admin - le trigger handle_new_local_admin s'occupera de créer l'utilisateur auth
      const { error: createError } = await supabase
        .from("local_admins")
        .insert({
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          phone_number: newProfile.phone_number,
          email: newProfile.email,
          agency_id: newProfile.agency_id || agencyId,
          role: 'user'
        })

      if (createError) throw createError

      toast({
        title: "Administrateur ajouté",
        description: "Le nouvel administrateur a été ajouté avec succès. Un mot de passe temporaire a été généré.",
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
        description: error.message || "Une erreur est survenue lors de l'ajout de l'administrateur",
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