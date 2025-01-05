import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/components/admin/profile/types"

export function useProfiles() {
  const { data: profiles = [], refetch: refetchProfiles } = useQuery({
    queryKey: ["agency-profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("No agency found")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("agency_id", profile.agency_id)

      if (error) throw error
      return data as Profile[]
    }
  })

  return {
    profiles,
    refetchProfiles
  }
}