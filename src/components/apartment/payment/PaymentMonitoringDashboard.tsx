import { useState } from "react"
import { PaymentStatusStats } from "./PaymentStatusStats"
import { PaymentFilters } from "./PaymentFilters"
import { PaymentsList } from "./PaymentsList"
import { PaymentDialog } from "./PaymentDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"

interface PaymentMonitoringDashboardProps {
  leaseId: string
}

export function PaymentMonitoringDashboard({ leaseId }: PaymentMonitoringDashboardProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("all")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suivi des paiements</h2>
        <Button onClick={() => setShowPaymentDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      <PaymentStatusStats leaseId={leaseId} />

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
      />
    </div>
  )
}