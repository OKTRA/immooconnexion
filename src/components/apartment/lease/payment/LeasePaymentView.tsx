import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, differenceInDays, isAfter, isBefore, isToday } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"
import { LeasePaymentViewProps, PaymentSummary, LeaseData } from "./types"
import { LeaseHeader } from "./components/LeaseHeader"
import { PaymentDialogs } from "./components/PaymentDialogs"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("payment_date", { ascending: false })

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError)
        throw paymentsError
      }

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

      // Find current period payment
      const currentPeriod = regularPayments.find(p => {
        const start = new Date(p.payment_period_start)
        const end = new Date(p.payment_period_end)
        const now = new Date()
        return isAfter(now, start) && isBefore(now, end)
      })

      return { 
        ...data, 
        initialPayments, 
        regularPayments,
        currentPeriod 
      } as LeaseData
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

  const getPaymentProgress = (payment: any) => {
    if (!payment?.payment_period_start || !payment?.payment_period_end) return 0
    const start = new Date(payment.payment_period_start)
    const end = new Date(payment.payment_period_end)
    const now = new Date()
    const totalDays = differenceInDays(end, start)
    const elapsedDays = differenceInDays(now, start)
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
  }

  const getStatusBadge = (payment: any) => {
    if (!payment) return null
    
    const getVariant = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
          return 'default'
        case 'paid_advance':
          return 'secondary'
        case 'pending':
          return 'warning'
        case 'late':
          return 'destructive'
        default:
          return 'outline'
      }
    }

    const getIcon = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
        case 'paid_advance':
          return <CheckCircle2 className="w-4 h-4 mr-1" />
        case 'pending':
          return <Clock className="w-4 h-4 mr-1" />
        case 'late':
          return <AlertCircle className="w-4 h-4 mr-1" />
        default:
          return <Calendar className="w-4 h-4 mr-1" />
      }
    }

    return (
      <Badge 
        variant={getVariant(payment.status)}
        className="flex items-center"
      >
        {getIcon(payment.status)}
        {payment.status === 'paid' ? 'Payé' :
         payment.status === 'pending' ? 'En attente' :
         payment.status === 'late' ? 'En retard' : 
         payment.status}
      </Badge>
    )
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

      {/* Current Period Card */}
      {lease.currentPeriod && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Période en cours</span>
              {getStatusBadge(lease.currentPeriod)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Du {format(new Date(lease.currentPeriod.payment_period_start), 'PP', { locale: fr })}
              </span>
              <span>
                Au {format(new Date(lease.currentPeriod.payment_period_end), 'PP', { locale: fr })}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{Math.round(getPaymentProgress(lease.currentPeriod))}%</span>
              </div>
              <Progress 
                value={getPaymentProgress(lease.currentPeriod)} 
                className="h-2"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold">
                {lease.currentPeriod.amount.toLocaleString()} FCFA
              </span>
              {lease.currentPeriod.status === 'pending' && (
                <button
                  onClick={() => setShowRegularPaymentDialog(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Payer maintenant
                </button>
              )}
            </div>
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