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
        const { data: authData, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          throw new Error("Authentication failed")
        }

        if (!authData.user) {
          throw new Error("Not authenticated")
        }

        // Check admin status
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", authData.user.id)
          .maybeSingle()

        if (adminError) {
          console.error('Admin check error:', adminError)
          // Continue even if admin check fails - will fall back to regular permissions
        }

        if (adminData?.is_super_admin) {
          console.log("User is super admin")
        }

        // Fetch profiles with a single query that includes agency data
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            *,
            agencies (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // Map and return the results
        return profiles?.map(profile => ({
          ...profile,
          agency_name: profile.agencies?.name || '-'
        })) || []

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
    refetchOnWindowFocus: false,
  })
}