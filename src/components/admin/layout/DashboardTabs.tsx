import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminProfiles } from "../AdminProfiles"
import AdminSubscriptionPlans from "../subscription/AdminSubscriptionPlans"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminPaymentDashboard } from "../dashboard/AdminPaymentDashboard"
import { AdminTransactionHistory } from "../dashboard/AdminTransactionHistory"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  BarChart3, 
  Building2, 
  Users, 
  Receipt, 
  CircleDollarSign, 
  History 
} from "lucide-react"

export function DashboardTabs() {
  const isMobile = useIsMobile()

  const tabs = [
    {
      value: "stats",
      label: "Statistiques",
      icon: BarChart3,
      content: <AdminStats />
    },
    {
      value: "agencies",
      label: "Agences",
      icon: Building2,
      content: <AdminAgencies />
    },
    {
      value: "agents",
      label: "Agents",
      icon: Users,
      content: <AdminProfiles />
    },
    {
      value: "plans",
      label: "Plans d'abonnement",
      icon: Receipt,
      content: <AdminSubscriptionPlans />
    },
    {
      value: "payments",
      label: "Paiements",
      icon: CircleDollarSign,
      content: <AdminPaymentDashboard />
    },
    {
      value: "transactions",
      label: "Transactions",
      icon: History,
      content: <AdminTransactionHistory />
    }
  ]

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}