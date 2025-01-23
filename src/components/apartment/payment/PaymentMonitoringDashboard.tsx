import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentStatusStats } from "./PaymentStatusStats"
import { PaymentsList } from "./PaymentsList"
import { PaymentFilters } from "./PaymentFilters"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard } from "lucide-react"
import { PaymentDialog } from "./PaymentDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"
import { InitialPaymentDialog } from "./components/InitialPaymentDialog"

interface PaymentMonitoringDashboardProps {
  tenantId: string
}

export function PaymentMonitoringDashboard({ tenantId }: PaymentMonitoringDashboardProps) {
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("current")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)

  const { data: paymentStats = {
    total: 0,
    paid: 0,
    pending: 0,
    late: 0
  }} = useQuery({
    queryKey: ["payment-stats", tenantId],
    queryFn: async () => {
      const { data: periods } = await supabase
        .from("apartment_payment_periods")
        .select(`
          *,
          apartment_leases!inner (
            tenant_id
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId)
      
      if (!periods) return {
        total: 0,
        paid: 0,
        pending: 0,
        late: 0
      }

      return {
        total: periods.reduce((sum, p) => sum + Number(p.amount), 0),
        paid: periods.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0),
        pending: periods.filter(p => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0),
        late: periods.filter(p => p.status === "late").reduce((sum, p) => sum + Number(p.amount), 0),
      }
    }
  })

  const { data: lease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["tenant-lease", tenantId],
    queryFn: async () => {
      console.log("Fetching lease for tenant:", tenantId)
      const { data, error } = await supabase
        .from("apartment_leases")
        .select("*, apartment_tenants(first_name, last_name)")
        .eq("tenant_id", tenantId)
        .maybeSingle()
      
      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }
      
      console.log("Fetched lease:", data)
      return data
    }
  })

  if (isLoadingLease) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suivi des Paiements</h1>
        <div className="flex gap-2">
          {lease && lease.initial_payments_completed === false && (
            <Button onClick={() => setShowInitialPaymentDialog(true)} variant="secondary">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiements Initiaux
            </Button>
          )}
          {lease && lease.initial_payments_completed === true && (
            <Button onClick={() => setShowPaymentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Paiement de Loyer
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <PaymentStatusStats stats={paymentStats} />
          </div>
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
          <div className="overflow-hidden">
            <PaymentsList
              tenantId={tenantId}
              periodFilter={periodFilter}
              statusFilter={statusFilter}
            />
          </div>
        </CardContent>
      </Card>

      <PaymentDialog 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}
        tenantId={tenantId}
      />

      <InitialPaymentDialog
        open={showInitialPaymentDialog}
        onOpenChange={setShowInitialPaymentDialog}
        tenantId={tenantId}
      />
    </div>
  )
}