import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminProfiles } from "../AdminProfiles"
import AdminSubscriptionPlans from "../subscription/AdminSubscriptionPlans"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { Building2, Receipt, Users } from "lucide-react"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="agencies" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Agences
        </TabsTrigger>
        <TabsTrigger value="plans" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Plans d'abonnement
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <AdminStats />
      </TabsContent>

      <TabsContent value="agents">
        <AdminProfiles />
      </TabsContent>

      <TabsContent value="agencies">
        <AdminAgencies />
      </TabsContent>

      <TabsContent value="plans">
        <AdminSubscriptionPlans />
      </TabsContent>
    </Tabs>
  )
}