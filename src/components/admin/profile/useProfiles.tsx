import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // Get current user
        const userResponse = await supabase.auth.getUser()
        const user = userResponse.data.user
        
        if (!user) {
          throw new Error("Not authenticated")
        }

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        if (adminError) {
          console.error('Admin check error:', adminError)
        }

        // Fetch profiles with agency info
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            email,
            role,
            phone_number,
            agency_id,
            created_at,
            agency:agencies (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // Return empty array if no profiles found
        if (!profiles) {
          return []
        }

        // Map the results to include agency name
        return profiles.map(profile => ({
          ...profile,
          agency_name: profile.agency?.name || '-'
        }))

      } catch (error: any) {
        console.error('Error in useProfiles:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils. Veuillez réessayer.",
          variant: "destructive",
        })
        throw error
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  })
}