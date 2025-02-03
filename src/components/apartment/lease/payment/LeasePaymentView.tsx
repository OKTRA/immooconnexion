import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { LeasePaymentViewProps, PaymentSummary, LeaseData } from "./types"
import { LeaseHeader } from "./components/LeaseHeader"
import { PaymentsList } from "./components/PaymentsList"
import { PaymentDialogs } from "./components/PaymentDialogs"
import { PaymentStatusStats } from "./components/PaymentStatusStats"
import { PaymentTimeline } from "./components/PaymentTimeline"
import { useState } from "react"
import { isAfter, isBefore } from "date-fns"

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)
  const [showRegularPaymentDialog, setShowRegularPaymentDialog] = useState(false)

  const { data: lease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      console.log("Fetching lease data for:", leaseId)
      const { data: leaseData, error: leaseError } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants (
            id,
            first_name,
            last_name,
            phone_number,
            email
          ),
          unit:apartment_units (
            id,
            unit_number,
            apartment:apartments (
              id,
              name
            )
          )
        `)
        .eq("id", leaseId)
        .maybeSingle()

      if (leaseError) {
        console.error("Error fetching lease:", leaseError)
        throw leaseError
      }

      if (!leaseData) {
        console.error("No lease found with ID:", leaseId)
        return null
      }

      // Fetch all payments for this lease
      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("payment_date", { ascending: false })

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError)
        throw paymentsError
      }

      // Verify initial payments are actually completed
      const hasDepositPayment = payments?.some(p => 
        p.payment_type === 'deposit' && p.status === 'paid'
      )
      const hasAgencyFeesPayment = payments?.some(p => 
        p.payment_type === 'agency_fees' && p.status === 'paid'
      )
      const initialPaymentsCompleted = hasDepositPayment && hasAgencyFeesPayment

      const initialPayments = payments?.filter(p => 
        p.payment_type === 'deposit' || p.payment_type === 'agency_fees'
      ).map(p => ({
        ...p,
        type: p.payment_type
      })) || []
      
      const regularPayments = payments?.filter(p => 
        p.payment_type !== 'deposit' && p.payment_type !== 'agency_fees'
      ).map(p => ({
        ...p,
        displayStatus: p.payment_status_type || p.status
      })) || []

      const currentPeriod = regularPayments.find(p => {
        if (!p.payment_period_start || !p.payment_period_end) return false
        const start = new Date(p.payment_period_start)
        const end = new Date(p.payment_period_end)
        const now = new Date()
        return isAfter(now, start) && isBefore(now, end)
      })

      return { 
        ...leaseData, 
        initialPayments,
        regularPayments,
        currentPeriod,
        initial_payments_completed: initialPaymentsCompleted
      } as LeaseData
    },
    retry: 1
  })

  const { data: stats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      console.log("Fetching payment stats for lease:", leaseId)
      
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status, due_date")
        .eq("lease_id", leaseId)

      if (error) throw error

      const totalReceived = payments
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const pendingAmount = payments
        ?.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const lateAmount = payments
        ?.filter(p => p.status === 'late')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const nextPayment = payments
        ?.filter(p => p.status === 'pending')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]

      return {
        totalReceived,
        pendingAmount,
        lateAmount,
        nextPayment: nextPayment ? {
          amount: nextPayment.amount,
          due_date: nextPayment.due_date
        } : undefined
      } as PaymentSummary
    }
  })

  const handlePaymentSuccess = () => {
    setShowRegularPaymentDialog(false)
    setShowInitialPaymentDialog(false)
  }

  if (isLoadingLease) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!lease) {
    return <div className="text-center p-4 text-muted-foreground">Bail non trouvé</div>
  }

  return (
    <div className="space-y-8">
      <LeaseHeader 
        lease={lease}
        onInitialPayment={() => setShowInitialPaymentDialog(true)}
      />
      
      {stats && <PaymentStatusStats stats={stats} />}

      {lease.initial_payments_completed && (
        <PaymentTimeline 
          lease={lease}
          initialPayments={lease.initialPayments || []}
        />
      )}

      <PaymentsList 
        title="Paiements Initiaux" 
        payments={lease.initialPayments || []}
        className="w-full"
      />
      
      {lease.initial_payments_completed && (
        <PaymentsList 
          title="Paiements de Loyer" 
          payments={lease.regularPayments || []}
          className="w-full"
        />
      )}

      <PaymentDialogs 
        lease={lease}
        showInitialPaymentDialog={showInitialPaymentDialog}
        showRegularPaymentDialog={showRegularPaymentDialog}
        onInitialDialogChange={setShowInitialPaymentDialog}
        onRegularDialogChange={setShowRegularPaymentDialog}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}