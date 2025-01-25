import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"

interface LeasePaymentViewProps {
  leaseId: string;
}

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
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
    </div>
  )
}