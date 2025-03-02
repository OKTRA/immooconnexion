
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LeaseHeader } from "./components/LeaseHeader"
import { LeasePaymentContent } from "./components/LeasePaymentContent"
import { InitialPaymentForm } from "@/components/apartment/payment/components/InitialPaymentForm"
import { PaymentForm } from "./PaymentForm"
import { Skeleton } from "@/components/ui/skeleton"
import { LeasePaymentViewProps, LeaseData } from "./types"

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  
  // Fetch lease data
  const { data: lease, isLoading, refetch } = useQuery({
    queryKey: ["lease-payment-view", leaseId],
    queryFn: async () => {
      try {
        // Fetch lease details
        const { data: leaseData, error: leaseError } = await supabase
          .from("apartment_leases")
          .select(`
            *,
            tenant:apartment_tenants(*),
            unit:apartment_units(
              *,
              apartment:apartments(*)
            )
          `)
          .eq("id", leaseId)
          .single()

        if (leaseError) throw leaseError

        // Fetch payments for this lease
        const { data: payments, error: paymentsError } = await supabase
          .from("apartment_lease_payments")
          .select("*")
          .eq("lease_id", leaseId)
          .order("due_date", { ascending: true })

        if (paymentsError) throw paymentsError

        // Format the lease data
        const formattedLease: LeaseData = {
          ...leaseData,
          initialPayments: payments?.filter(p => 
            p.payment_type === "deposit" || p.payment_type === "agency_fees"
          ),
          regularPayments: payments?.filter(p => 
            p.payment_type === "rent"
          ),
        }

        return formattedLease
      } catch (error) {
        console.error("Error fetching lease data:", error)
        throw error
      }
    }
  })

  const handleInitialPaymentSuccess = async () => {
    setShowInitialPaymentDialog(false)
    await refetch()
  }

  const handlePaymentSuccess = async () => {
    setShowPaymentDialog(false)
    await refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!lease) {
    return <div>Bail non trouvé</div>
  }

  const canMakeRegularPayments = lease.initial_payments_completed || lease.initial_fees_paid
  const needsInitialPayments = !lease.initial_payments_completed && !lease.initial_fees_paid
  
  return (
    <div className="space-y-6">
      {/* Header with information and buttons */}
      <LeaseHeader
        lease={lease}
        onInitialPayment={() => setShowInitialPaymentDialog(true)}
        onRegularPayment={() => setShowPaymentDialog(true)}
        canMakeRegularPayments={canMakeRegularPayments}
        needsInitialPayments={needsInitialPayments}
      />

      {/* Payment content */}
      <LeasePaymentContent lease={lease} />

      {/* Initial payment dialog */}
      <Dialog open={showInitialPaymentDialog} onOpenChange={setShowInitialPaymentDialog}>
        <DialogContent className="max-w-xl">
          <h2 className="text-xl font-bold mb-4">Paiements Initiaux</h2>
          <InitialPaymentForm 
            lease={lease}
            onSuccess={handleInitialPaymentSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Regular payment dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Gestion des Paiements</h2>
          <PaymentForm 
            lease={lease}
            leaseId={leaseId}
            onSuccess={handlePaymentSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
