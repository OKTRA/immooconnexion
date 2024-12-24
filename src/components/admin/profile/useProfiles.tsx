import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            agencies!inner (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching profiles:', error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les profils",
            variant: "destructive",
          })
          throw error
        }

        // Transform the data to include agency_name directly
        const transformedData = data?.map(profile => ({
          ...profile,
          agency_name: profile.agencies?.name || '-'
        })) || []

        return transformedData
      } catch (error: any) {
        console.error('Error in useProfiles:', error)
        throw error
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  })
}