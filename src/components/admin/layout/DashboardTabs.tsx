import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminProperties } from "../dashboard/AdminProperties"
import { AdminSubscriptionPlans } from "../subscription/AdminSubscriptionPlans"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="agencies">Agences</TabsTrigger>
        <TabsTrigger value="properties">Biens</TabsTrigger>
        <TabsTrigger value="plans">Abonnements</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>
        <TabsContent value="agencies">
          <AdminAgencies />
        </TabsContent>
        <TabsContent value="properties">
          <AdminProperties />
        </TabsContent>
        <TabsContent value="plans">
          <AdminSubscriptionPlans />
        </TabsContent>
      </div>
    </Tabs>
  )
}