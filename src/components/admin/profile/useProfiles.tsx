import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // First check if user is super admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user?.id)
          .maybeSingle()

        if (adminError) throw adminError

        // Build the base query
        let query = supabase
          .from("profiles")
          .select(`
            *,
            agency:agencies(name)
          `)
          .order('created_at', { ascending: false })

        // Execute query
        const { data: profiles, error: profilesError } = await query

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        // If no profiles found, return an empty array
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