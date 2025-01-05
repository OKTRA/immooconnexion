import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useAgencies() {
  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  return {
    agencyId: profile?.agency_id
  }
}