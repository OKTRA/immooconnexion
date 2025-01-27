import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/apartment/payment/PaymentForm"
import { InitialPaymentForm } from "@/components/apartment/payment/components/InitialPaymentForm"
import { CreditCard, PlusCircle, Loader2 } from "lucide-react"
import { LeasePaymentViewProps, PaymentSummary, LeaseData } from "../payment/types"
import { toast } from "@/components/ui/use-toast"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"

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
      {stats && <PaymentStats stats={stats} />}
      
      <div className="flex gap-4 justify-end">
        {!lease?.initial_payments_completed && (
          <Button 
            onClick={() => setShowInitialPaymentDialog(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Paiements Initiaux
          </Button>
        )}
        
        {lease?.initial_payments_completed && (
          <Button 
            onClick={() => setShowRegularPaymentDialog(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Paiement de Loyer
          </Button>
        )}
      </div>

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

      <Dialog open={showInitialPaymentDialog} onOpenChange={setShowInitialPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiements Initiaux</DialogTitle>
          </DialogHeader>
          <InitialPaymentForm 
            onSuccess={handlePaymentSuccess}
            lease={lease}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegularPaymentDialog} onOpenChange={setShowRegularPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Paiement de Loyer</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            onSuccess={handlePaymentSuccess}
            leaseId={leaseId}
            lease={lease}
            isHistorical={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
