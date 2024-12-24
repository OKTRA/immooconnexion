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
        
        // First check if user is super admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user?.id)
          .maybeSingle()

        if (adminError) {
          console.error('Error checking admin status:', adminError)
          throw adminError
        }

        // If super admin, fetch all profiles
        if (adminData?.is_super_admin) {
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*, agency:agencies(name)")
            .order('created_at', { ascending: false })

          if (profilesError) throw profilesError

          return profiles.map(profile => ({
            ...profile,
            agency_name: profile.agency?.name || '-'
          }))
        }

        // If not super admin, fetch based on regular admin permissions
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*, agency:agencies(name)")
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        return profiles.map(profile => ({
          ...profile,
          agency_name: profile.agency?.name || '-'
        }))
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