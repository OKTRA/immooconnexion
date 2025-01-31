import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { LeaseData } from "../types"
import { LeaseHeader } from "./components/LeaseHeader"
import { PaymentsList } from "./components/PaymentsList"
import { PaymentDialogs } from "./components/PaymentDialogs"
import { PaymentStatusStats } from "./components/PaymentStatusStats"
import { CurrentPeriodCard } from "./components/CurrentPeriodCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentCountdown } from "./components/PaymentCountdown"
import { useState } from "react"
import { isAfter, isBefore } from "date-fns"

interface LeasePaymentViewProps {
  leaseId: string;
}

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

      if (leaseError) throw leaseError
      if (!leaseData) return null

      // Récupérer le paiement de dépôt avec first_rent_start_date
      const { data: depositPayment, error: depositError } = await supabase
        .from("apartment_lease_payments")
        .select("first_rent_start_date")
        .eq("lease_id", leaseId)
        .eq("payment_type", "deposit")
        .single()

      if (depositError) {
        console.error("Error fetching deposit payment:", depositError)
      }

      console.log("Found deposit payment:", depositPayment)

      // Récupérer tous les paiements
      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("payment_date", { ascending: false })

      if (paymentsError) throw paymentsError

      const initialPayments = payments?.filter(p => 
        p.payment_type === 'deposit' || p.payment_type === 'agency_fees'
      ) || []
      
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
        first_rent_start_date: depositPayment?.first_rent_start_date
      } as LeaseData
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
      
      {lease.initial_fees_paid && lease.first_rent_start_date && (
        <Card>
          <CardHeader>
            <CardTitle>Prochain Paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PaymentCountdown 
              firstRentDate={new Date(lease.first_rent_start_date)}
              frequency={lease.payment_frequency}
            />
            
            {lease.currentPeriod && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Période de paiement actuelle</h4>
                <CurrentPeriodCard
                  currentPeriod={lease.currentPeriod}
                  onPaymentClick={() => setShowRegularPaymentDialog(true)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

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