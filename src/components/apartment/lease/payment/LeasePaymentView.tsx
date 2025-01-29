import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"
import { LeasePaymentViewProps, PaymentSummary, LeaseData } from "./types"
import { LeaseHeader } from "./components/LeaseHeader"
import { PaymentDialogs } from "./components/PaymentDialogs"
import { useState } from "react"

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)
  const [showRegularPaymentDialog, setShowRegularPaymentDialog] = useState(false)

  const { data: lease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      console.log("Fetching lease data for:", leaseId)
      const { data, error } = await supabase
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

      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }

      // Fetch payments for this lease
      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("payment_date", { ascending: false })

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError)
        throw paymentsError
      }

      // Add payments to lease data
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

      console.log("Lease data:", { ...data, initialPayments, regularPayments })
      return { ...data, initialPayments, regularPayments } as LeaseData
    }
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
    toast({
      title: "Succès",
      description: "Le paiement a été enregistré avec succès",
    })
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
        onRegularPayment={() => setShowRegularPaymentDialog(true)}
      />
      
      {stats && <PaymentStats stats={stats} />}

      <PaymentsList 
        title="Paiements Initiaux" 
        payments={lease.initialPayments || []}
        className="w-full"
      />
      
      <PaymentsList 
        title="Paiements de Loyer" 
        payments={lease.regularPayments || []}
        className="w-full"
      />

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
