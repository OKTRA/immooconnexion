import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useAgencyUsers(agencyId: string) {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["agency-users", agencyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("local_admins")
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          phone_number,
          created_at,
          agency_id
        `)
        .eq("agency_id", agencyId)
        .order('created_at', { ascending: false })
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        })
        throw error
      }

      return data || []
    },
  })
}