import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentStatusStats } from "./PaymentStatusStats"
import { PaymentsList } from "./PaymentsList"
import { PaymentFilters } from "./PaymentFilters"
import { useState } from "react"

export type PaymentPeriodFilter = "all" | "current" | "overdue" | "upcoming"
export type PaymentStatusFilter = "all" | "pending" | "paid" | "late"

export function PaymentMonitoringDashboard() {
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("current")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")

  const { data: paymentStats } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const { data: periods } = await supabase
        .from("apartment_payment_periods")
        .select("status, amount")
      
      if (!periods) return null

      const stats = {
        total: periods.reduce((sum, p) => sum + Number(p.amount), 0),
        paid: periods.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0),
        pending: periods.filter(p => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0),
        late: periods.filter(p => p.status === "late").reduce((sum, p) => sum + Number(p.amount), 0),
      }

      return stats
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring des Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentStatusStats stats={paymentStats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-6">
          <CardTitle>Liste des Paiements</CardTitle>
          <PaymentFilters
            periodFilter={periodFilter}
            statusFilter={statusFilter}
            onPeriodFilterChange={setPeriodFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardHeader>
        <CardContent>
          <PaymentsList
            periodFilter={periodFilter}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>
    </div>
  )
}