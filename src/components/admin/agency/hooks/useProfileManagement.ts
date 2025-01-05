import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";

export const useProfileManagement = (agencyId: string, onSuccess?: () => void) => {
  const { toast } = useToast();

  const createProfile = async (userId: string, profileData: Partial<Profile>) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
          role: profileData.role,
          agency_id: agencyId,
          status: 'active'
        });

      if (profileError) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le profil utilisateur",
          variant: "destructive",
        });
        throw profileError;
      }

      toast({
        title: "Succès",
        description: "Le compte a été créé avec succès",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const updateProfile = async (userId: string, profileData: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
          role: profileData.role,
          agency_id: agencyId,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return { createProfile, updateProfile };
};