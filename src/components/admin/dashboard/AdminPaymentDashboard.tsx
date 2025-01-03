import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/components/RevenueChart"
import { StatCard } from "@/components/StatCard"
import { CircleDollarSign, TrendingUp, Users } from "lucide-react"

export function AdminPaymentDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-payment-stats"],
    queryFn: async () => {
      const { data: notifications } = await supabase
        .from("admin_payment_notifications")
        .select("amount, status")

      if (!notifications) return { total: 0, success: 0, pending: 0 }

      const total = notifications.reduce((sum, n) => sum + n.amount, 0)
      const success = notifications.filter(n => n.status === "success").length
      const pending = notifications.filter(n => n.status === "pending").length

      return { total, success, pending }
    }
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total des paiements"
          value={`${stats?.total?.toLocaleString() || 0} FCFA`}
          icon={CircleDollarSign}
        />
        <StatCard
          title="Paiements réussis"
          value={stats?.success?.toString() || "0"}
          icon={TrendingUp}
        />
        <StatCard
          title="Paiements en attente"
          value={stats?.pending?.toString() || "0"}
          icon={Users}
        />
      </div>
      <RevenueChart />
    </div>
  )
}