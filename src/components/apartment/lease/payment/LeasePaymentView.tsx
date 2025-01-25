import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/apartment/payment/PaymentForm"
import { CreditCard, PlusCircle } from "lucide-react"

interface LeasePaymentViewProps {
  leaseId: string;
}

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false)
  const [showRegularPaymentDialog, setShowRegularPaymentDialog] = useState(false)

  const { data: lease } = useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:tenant_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq("id", leaseId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status, due_date")
        .eq("lease_id", leaseId)

      if (error) throw error

      const totalReceived = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const pendingAmount = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const lateAmount = payments
        .filter(p => p.status === 'late')
        .reduce((sum, p) => sum + (p.amount || 0), 0)

      const nextPayment = payments
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]

      return {
        totalReceived,
        pendingAmount,
        lateAmount,
        nextPayment: nextPayment ? {
          amount: nextPayment.amount,
          due_date: nextPayment.due_date
        } : undefined
      }
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

  if (isLoadingStats) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <PaymentsList 
          title="Paiements Initiaux" 
          payments={initialPayments} 
        />
        <PaymentsList 
          title="Paiements de Loyer" 
          payments={regularPayments}
        />
      </div>

      <Dialog open={showInitialPaymentDialog} onOpenChange={setShowInitialPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiements Initiaux</DialogTitle>
          </DialogHeader>
          {lease?.tenant && (
            <PaymentForm 
              onSuccess={() => setShowInitialPaymentDialog(false)}
              tenantId={lease.tenant.id}
              leaseId={leaseId}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRegularPaymentDialog} onOpenChange={setShowRegularPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Paiement de Loyer</DialogTitle>
          </DialogHeader>
          {lease?.tenant && (
            <PaymentForm 
              onSuccess={() => setShowRegularPaymentDialog(false)}
              tenantId={lease.tenant.id}
              leaseId={leaseId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}