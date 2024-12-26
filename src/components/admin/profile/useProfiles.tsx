import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Agency } from "@/components/admin/agency/types"

interface ProfileWithAgency {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: string | null;
  agency_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  agencies: Agency | null;
  agency_name?: string;
}

export function useProfiles() {
  const { toast } = useToast()

  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      try {
        // First check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          throw new Error("Authentication required")
        }

        // Get current user
        const { data: authData, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          throw new Error("Authentication failed")
        }

        if (!authData.user) {
          throw new Error("Not authenticated")
        }

        // Check admin status using maybeSingle() instead of single()
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", authData.user.id)
          .maybeSingle()

        if (adminError) {
          console.error('Admin check error:', adminError)
          // Continue even if admin check fails - will fall back to regular permissions
        }

        // Log admin status for debugging
        console.log("Admin status:", adminData?.is_super_admin)

        // Fetch profiles with a single query that includes agency data
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            *,
            agencies (
              id,
              name,
              address,
              phone,
              email,
              subscription_plan_id,
              show_phone_on_site,
              list_properties_on_site,
              created_at,
              updated_at,
              logo_url
            )
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }

        if (!profiles) {
          return []
        }

        // Map and return the results with proper type casting
        return (profiles as unknown as ProfileWithAgency[])?.map(profile => ({
          ...profile,
          agency_name: profile.agencies?.name || '-'
        })) || []

      } catch (error: any) {
        console.error('Error in useProfiles:', error)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les profils. Veuillez réessayer.",
          variant: "destructive",
        })
        throw error
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  })
}