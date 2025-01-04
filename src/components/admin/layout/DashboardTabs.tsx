import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminProfiles } from "../AdminProfiles"
import AdminSubscriptionPlans from "../subscription/AdminSubscriptionPlans"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminPaymentDashboard } from "../dashboard/AdminPaymentDashboard"
import { AdminTransactionHistory } from "../dashboard/AdminTransactionHistory"
import { SubscriptionUpgradeTab } from "@/components/agency/subscription/SubscriptionUpgradeTab"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { 
  BarChart3, 
  Building2, 
  Users, 
  Receipt, 
  CircleDollarSign, 
  History,
  ArrowUpDown
} from "lucide-react"

export function DashboardTabs() {
  const isMobile = useIsMobile()

  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select(`
          *,
          agencies (
            id,
            name,
            subscription_plan_id
          )
        `)
        .eq("id", user.id)
        .single()

      return data
    },
  })

  const isAgencyAdmin = profile?.role === 'admin' && profile?.agency_id

  const tabs = [
    {
      value: "stats",
      label: "Statistiques",
      icon: BarChart3,
      content: <AdminStats />,
      show: true
    },
    {
      value: "agencies",
      label: "Agences",
      icon: Building2,
      content: <AdminAgencies />,
      show: true
    },
    {
      value: "agents",
      label: "Agents",
      icon: Users,
      content: <AdminProfiles />,
      show: true
    },
    {
      value: "plans",
      label: "Plans d'abonnement",
      icon: Receipt,
      content: <AdminSubscriptionPlans />,
      show: true
    },
    {
      value: "payments",
      label: "Paiements",
      icon: CircleDollarSign,
      content: <AdminPaymentDashboard />,
      show: true
    },
    {
      value: "transactions",
      label: "Transactions",
      icon: History,
      content: <AdminTransactionHistory />,
      show: true
    },
    {
      value: "upgrade",
      label: "Changer de plan",
      icon: ArrowUpDown,
      content: <SubscriptionUpgradeTab />,
      show: isAgencyAdmin
    }
  ]

  const visibleTabs = tabs.filter(tab => tab.show)

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className={`grid w-full grid-cols-${visibleTabs.length}`}>
        {visibleTabs.map(({ value, label, icon: Icon }) => (
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

      {visibleTabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}