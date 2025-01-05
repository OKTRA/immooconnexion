import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";
import { useExistingUserCheck } from "./useExistingUserCheck";
import { useProfileManagement } from "./useProfileManagement";

interface ExtendedProfile extends Profile {
  password?: string;
}

export function useAgencyUserEdit(userId: string | null, agencyId: string, onSuccess?: () => void) {
  const [newProfile, setNewProfile] = useState<ExtendedProfile>({
    id: userId || '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'user',
    agency_id: agencyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  });

  const { toast } = useToast();
  const { checkExistingUser } = useExistingUserCheck();
  const { createProfile, updateProfile } = useProfileManagement(agencyId, onSuccess);

  const handleCreateAuthUser = async () => {
    try {
      // Store current admin session
      const { data: { session: adminSession } } = await supabase.auth.getSession();
      if (!adminSession) {
        throw new Error("No admin session found");
      }

      const userExists = await checkExistingUser(newProfile.email);
      if (userExists) return null;

      // Create new user
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: newProfile.email,
        password: newProfile.password || '',
        email_confirm: true
      });

      if (signUpError) {
        let errorMessage = "Erreur lors de la création du compte";
        
        if (signUpError.message.includes("password")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (signUpError.message.includes("email")) {
          errorMessage = "Veuillez entrer une adresse email valide";
        }

        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        });
        throw signUpError;
      }

      if (!authData.user) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le compte utilisateur",
          variant: "destructive",
        });
        throw new Error("No user data returned");
      }

      // Create profile for new user
      await createProfile(authData.user.id, newProfile);

      // Restore admin session
      await supabase.auth.setSession(adminSession);
      
      return authData.user.id;
    } catch (error: any) {
      console.error("Error creating auth user:", error);
      // Ensure we attempt to restore admin session even if there's an error
      const { data: { session: adminSession } } = await supabase.auth.getSession();
      if (adminSession) {
        await supabase.auth.setSession(adminSession);
      }
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "ID utilisateur manquant",
        variant: "destructive",
      });
      return;
    }

    await updateProfile(userId, newProfile);
  };

  return {
    newProfile,
    setNewProfile,
    handleCreateAuthUser,
    handleUpdateProfile,
  };
}