import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAvailableProperties(userProfile: any | undefined) {
  return useQuery({
    queryKey: ['available-properties', userProfile?.agency_id],
    queryFn: async () => {
      if (!userProfile?.agency_id) return [];

      let query = supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible');

      if (userProfile.role !== 'admin') {
        query = query.eq('agency_id', userProfile.agency_id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.agency_id
  });
}