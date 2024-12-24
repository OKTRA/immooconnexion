import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // Get current user in a separate query
        const { data: authData, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          throw new Error("Authentication failed")
        }

        if (!authData.user) {
          throw new Error("Not authenticated")
        }

        // Check admin status in a separate query
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", authData.user.id)
          .maybeSingle()

        if (adminError) {
          console.error('Admin check error:', adminError)
          // Continue even if admin check fails - will fall back to regular permissions
        }

        // Fetch profiles in a separate query with explicit field selection
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
            agency:agencies!inner (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // Map the results to include agency name
        return (profiles || []).map(profile => ({
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
    refetchOnWindowFocus: false,
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error)
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    }
  })
}