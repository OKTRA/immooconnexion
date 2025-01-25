import { useState } from "react"
import { PaymentStatusStats } from "./PaymentStatusStats"
import { PaymentFilters } from "./PaymentFilters"
import { PaymentsList } from "./PaymentsList"
import { PaymentDialog } from "./PaymentDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

interface PaymentMonitoringDashboardProps {
  leaseId: string
}

export function PaymentMonitoringDashboard({ leaseId }: PaymentMonitoringDashboardProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("all")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")
  const [paymentType, setPaymentType] = useState<'rent' | 'deposit' | 'agency_fees'>('rent')

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["payment-stats", leaseId],
    queryFn: async () => {
      console.log("Fetching payment stats for lease:", leaseId)
      const { data: payments, error } = await supabase
        .from("tenant_payment_details")
        .select("*")
        .eq("lease_id", leaseId)

      if (error) throw error

      const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
      const paid = payments.reduce((sum, p) => p.status === 'paid' ? sum + (p.amount || 0) : sum, 0)
      const pending = payments.reduce((sum, p) => p.status === 'pending' ? sum + (p.amount || 0) : sum, 0)
      const late = payments.reduce((sum, p) => p.status === 'late' ? sum + (p.amount || 0) : sum, 0)

      return { total, paid, pending, late }
    }
  })

  const handleNewPayment = (type: 'rent' | 'deposit' | 'agency_fees') => {
    setPaymentType(type)
    setShowPaymentDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suivi des paiements</h2>
        <div className="flex gap-2">
          <Button onClick={() => handleNewPayment('rent')}>
            <Plus className="h-4 w-4 mr-2" />
            Paiement de loyer
          </Button>
          <Button variant="outline" onClick={() => handleNewPayment('deposit')}>
            <Plus className="h-4 w-4 mr-2" />
            Paiement caution
          </Button>
          <Button variant="outline" onClick={() => handleNewPayment('agency_fees')}>
            <Plus className="h-4 w-4 mr-2" />
            Frais d'agence
          </Button>
        </div>
      </div>

      {isLoadingStats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <PaymentStatusStats stats={stats} />
      )}

      <PaymentFilters
        periodFilter={periodFilter}
        statusFilter={statusFilter}
        onPeriodFilterChange={setPeriodFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <PaymentsList
        periodFilter={periodFilter}
        statusFilter={statusFilter}
        leaseId={leaseId}
      />

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        leaseId={leaseId}
        paymentType={paymentType}
      />
    </div>
  )
}