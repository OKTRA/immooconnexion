import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        console.log("Fetching profiles...")
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // Then get all agencies in a separate query
        const { data: agencies, error: agenciesError } = await supabase
          .from("agencies")
          .select("id, name")

        if (agenciesError) {
          console.error('Error fetching agencies:', agenciesError)
          throw agenciesError
        }

        // Map agencies to profiles
        const transformedData = profiles.map(profile => ({
          ...profile,
          agency_name: agencies.find(agency => agency.id === profile.agency_id)?.name || '-'
        }))

        console.log("Profiles fetched successfully:", transformedData)
        return transformedData
      } catch (error: any) {
        console.error('Error in useProfiles:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils",
          variant: "destructive",
        })
        throw error
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  })
}