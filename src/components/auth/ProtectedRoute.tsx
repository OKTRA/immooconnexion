import { Navigate, Outlet } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLayout } from "../agency/AgencyLayout"

export function ProtectedRoute() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <AgencyLayout>
      <Outlet />
    </AgencyLayout>
  )
}