import { useState, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, AlertCircle } from "lucide-react"
import { PaymentDialog } from "./PaymentDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"
import { InitialPaymentDialog } from "./components/InitialPaymentDialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PaymentStatusStats } from "./PaymentStatusStats"
import { PaymentsList } from "./PaymentsList"
import { PaymentFilters } from "./PaymentFilters"

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

  const { data: lease, isLoading: isLoadingLease, error: leaseError } = useQuery({
    queryKey: ["tenant-lease", tenantId],
    queryFn: async () => {
      console.log("Fetching lease for tenant:", tenantId)
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants!inner (
            id,
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
            profession
          )
        `)
        .eq("tenant_id", tenantId)
        .eq("status", "active")
        .maybeSingle()
      
      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }
      
      if (!data) {
        return null
      }

      console.log("Lease data fetched:", data)
      return {
        ...data,
        tenant: data.tenant
      }
    },
    enabled: !!tenantId
  })

  if (isLoadingLease) {
    return <div>Chargement...</div>
  }

  if (leaseError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des données du bail
        </AlertDescription>
      </Alert>
    )
  }

  if (!lease) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucun bail actif n'a été trouvé pour ce locataire
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suivi des Paiements</h1>
        <div className="flex gap-2">
          {lease && !lease.initial_payments_completed && (
            <Button onClick={() => setShowInitialPaymentDialog(true)} variant="secondary">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiements Initiaux
            </Button>
          )}
          {lease && lease.initial_payments_completed && (
            <Button onClick={() => setShowPaymentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Paiement de Loyer
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-hidden">
            <PaymentStatusStats stats={paymentStats} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <PaymentFilters
            periodFilter={periodFilter}
            statusFilter={statusFilter}
            onPeriodFilterChange={setPeriodFilter}
            onStatusFilterChange={setStatusFilter}
          />
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