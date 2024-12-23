import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Non authentifié");

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, agency_id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!profile) throw new Error("Profil non trouvé");
      
      return profile;
    }
  });
}