import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

interface LeasePaymentViewProps {
  leaseId: string
}

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const { data: paymentStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select(`
          id,
          amount,
          status,
          payment_date,
          due_date,
          type
        `)
        .eq("lease_id", leaseId)

      if (error) throw error

      const stats = {
        totalReceived: 0,
        pendingAmount: 0,
        lateAmount: 0,
        nextPayment: null as any
      }

      data.forEach(payment => {
        if (payment.status === 'paid') {
          stats.totalReceived += payment.amount
        } else if (payment.status === 'pending') {
          stats.pendingAmount += payment.amount
        } else if (payment.status === 'late') {
          stats.lateAmount += payment.amount
        }
      })

      // Trouver le prochain paiement dû
      const pendingPayments = data
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

      if (pendingPayments.length > 0) {
        stats.nextPayment = pendingPayments[0]
      }

      return stats
    }
  })

  if (isLoadingStats) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reçu
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStats?.totalReceived?.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              En Attente
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStats?.pendingAmount?.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              En Retard
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStats?.lateAmount?.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Prochain Paiement
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {paymentStats?.nextPayment ? (
              <>
                <div className="text-2xl font-bold">
                  {paymentStats.nextPayment.amount.toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">
                  Dû le {format(new Date(paymentStats.nextPayment.due_date), 'PP', { locale: fr })}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Aucun paiement prévu
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Paiements */}
      <div className="grid gap-6 md:grid-cols-2">
        <InitialPaymentsCard leaseId={leaseId} />
        <RegularPaymentsCard leaseId={leaseId} />
      </div>
    </div>
  )
}

function InitialPaymentsCard({ leaseId }: { leaseId: string }) {
  const { data: initialPayments, isLoading } = useQuery({
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

  if (isLoading) return <div>Chargement...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiements Initiaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {initialPayments?.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  {payment.type === 'deposit' ? 'Caution' : 'Frais d\'agence'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.due_date), 'PP', { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                <Badge 
                  variant={
                    payment.status === 'paid' 
                      ? 'default' 
                      : payment.status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                  }
                >
                  {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'En retard'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RegularPaymentsCard({ leaseId }: { leaseId: string }) {
  const { data: regularPayments, isLoading } = useQuery({
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

  if (isLoading) return <div>Chargement...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiements de Loyer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regularPayments?.map(payment => (
            <div 
              key={payment.id} 
              className={`flex items-center justify-between p-4 border rounded-lg ${
                payment.status === 'paid' 
                  ? 'bg-green-50' 
                  : payment.status === 'pending' 
                    ? 'bg-yellow-50' 
                    : 'bg-red-50'
              }`}
            >
              <div>
                <p className="font-medium">
                  Loyer {format(new Date(payment.due_date), 'MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Échéance : {format(new Date(payment.due_date), 'PP', { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                <Badge 
                  variant={
                    payment.status === 'paid' 
                      ? 'default' 
                      : payment.status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                  }
                >
                  {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'En retard'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}