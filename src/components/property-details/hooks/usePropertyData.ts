import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const usePropertyData = (id: string | undefined) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) {
        console.error("No property ID provided")
        throw new Error("Property ID is required")
      }

      console.log("Fetching property details for ID:", id)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated")
        throw new Error("Non authentifié")
      }
      console.log("Current user ID:", user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()

      console.log("User profile:", profile)

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) {
        console.error("Error fetching property:", error)
        throw error
      }

      console.log("Property data:", data)
      return data
    },
    enabled: !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  })
}