import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import AdminProfiles from "../profile/AdminProfiles"
import AdminSubscriptionPlans from "../subscription/AdminSubscriptionPlans"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function DashboardTabs() {
  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      return data
    },
  })

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="plans">Plans</TabsTrigger>
      </TabsList>
      <TabsContent value="stats">
        <AdminStats />
      </TabsContent>
      <TabsContent value="agents">
        <AdminProfiles />
      </TabsContent>
      <TabsContent value="plans">
        <AdminSubscriptionPlans />
      </TabsContent>
    </Tabs>
  )
}