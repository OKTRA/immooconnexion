import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminProperties } from "../dashboard/AdminProperties"
import { AdminSubscriptionPlans } from "../subscription/AdminSubscriptionPlans"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="mt-8">
      <div className="mb-6 overflow-x-auto">
        <TabsList className="inline-flex w-auto min-w-full sm:w-full">
          <TabsTrigger value="overview" className="flex-1 min-w-[120px]">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="agencies" className="flex-1 min-w-[120px]">Agences</TabsTrigger>
          <TabsTrigger value="properties" className="flex-1 min-w-[120px]">Biens</TabsTrigger>
          <TabsTrigger value="plans" className="flex-1 min-w-[120px]">Abonnements</TabsTrigger>
        </TabsList>
      </div>
      
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