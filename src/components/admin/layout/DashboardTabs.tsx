import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminProfiles } from "../AdminProfiles"
import AdminSubscriptionPlans from "../subscription/AdminSubscriptionPlans"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminPaymentDashboard } from "../dashboard/AdminPaymentDashboard"
import { AdminTransactionHistory } from "../dashboard/AdminTransactionHistory"
import { AdminNotifications } from "../dashboard/AdminNotifications"
import { Building2, Receipt, Users, Bell, CircleDollarSign, History } from "lucide-react"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
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
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" />
          Paiements
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Transactions
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

      <TabsContent value="notifications">
        <AdminNotifications />
      </TabsContent>

      <TabsContent value="payments">
        <AdminPaymentDashboard />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactionHistory />
      </TabsContent>
    </Tabs>
  )
}