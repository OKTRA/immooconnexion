import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { LeasePaymentViewProps, PaymentSummary, LeaseData } from "./types"
import { toast } from "@/components/ui/use-toast"
import { PaymentButtons } from "./components/PaymentButtons"
import { PaymentDialogs } from "./components/PaymentDialogs"

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
            last_name
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
      console.log("Lease data:", data)
      return data as LeaseData
    }
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      console.log("Fetching payment stats for lease:", leaseId)
      
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status, due_date")
        .eq("lease_id", leaseId)

      if (error) {
        console.error("Error fetching payment stats:", error)
        throw error
      }

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

      console.log("Payment stats calculated:", { totalReceived, pendingAmount, lateAmount, nextPayment })

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

  const { data: initialPayments = [] } = useQuery({
    queryKey: ["lease-initial-payments", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .in("type", ["deposit", "agency_fees"])
        .order("due_date", { ascending: true })

      if (error) throw error
      return data
    }
  })

  const { data: regularPayments = [] } = useQuery({
    queryKey: ["lease-regular-payments", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("type", "rent")
        .order("due_date", { ascending: true })

      if (error) throw error
      return data
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

  if (isLoadingLease || isLoadingStats) {
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
      {stats && <PaymentStats stats={stats} />}
      
      <PaymentButtons 
        initialPaymentsCompleted={lease.initial_payments_completed || false}
        onInitialPaymentClick={() => setShowInitialPaymentDialog(true)}
        onRegularPaymentClick={() => setShowRegularPaymentDialog(true)}
      />

      <div className="space-y-8">
        <PaymentsList 
          title="Paiements Initiaux" 
          payments={initialPayments}
          className="w-full"
        />
        <PaymentsList 
          title="Paiements de Loyer" 
          payments={regularPayments}
          className="w-full"
        />
      </div>

      <PaymentDialogs 
        showInitialPaymentDialog={showInitialPaymentDialog}
        showRegularPaymentDialog={showRegularPaymentDialog}
        setShowInitialPaymentDialog={setShowInitialPaymentDialog}
        setShowRegularPaymentDialog={setShowRegularPaymentDialog}
        onSuccess={handlePaymentSuccess}
        leaseId={leaseId}
        lease={lease}
      />
    </div>
  )
}