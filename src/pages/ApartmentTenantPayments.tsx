import { useParams } from "react-router-dom"
import { PaymentsList } from "@/components/apartment/payment/PaymentsList"
import { PaymentFilters } from "@/components/apartment/payment/PaymentFilters"
import { PaymentStatusStats } from "@/components/apartment/payment/PaymentStatusStats"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useState } from "react"
import { PaymentPeriodFilter, PaymentStatusFilter } from "@/components/apartment/payment/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export default function ApartmentTenantPayments() {
  const { leaseId } = useParams<{ leaseId: string }>()
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("all")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")

  const { data: stats } = useQuery({
    queryKey: ["payment-stats", leaseId],
    queryFn: async () => {
      if (!leaseId) return null

      const { data: payments } = await supabase
        .from("tenant_payment_details")
        .select("amount, status")
        .eq("lease_id", leaseId)

      if (!payments) return null

      return {
        total: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        paid: payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0),
        pending: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0),
        late: payments.filter(p => p.status === "late").reduce((sum, p) => sum + (p.amount || 0), 0)
      }
    }
  })

  if (!leaseId) {
    return <div>Bail non trouvé</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        <PaymentStatusStats stats={stats} />
        
        <PaymentFilters
          periodFilter={periodFilter}
          statusFilter={statusFilter}
          onPeriodFilterChange={setPeriodFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <PaymentsList
          leaseId={leaseId}
          periodFilter={periodFilter}
          statusFilter={statusFilter}
        />
      </div>
    </AgencyLayout>
  )
}