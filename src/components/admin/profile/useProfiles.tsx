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
        
        // Récupérer les profils
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*, agency:agencies(name)")
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // Transformer les données pour inclure le nom de l'agence
        const transformedData = profiles.map(profile => ({
          ...profile,
          agency_name: profile.agency?.name || '-'
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