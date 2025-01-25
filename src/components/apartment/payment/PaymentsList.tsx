import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentListProps } from "./types"

export function PaymentsList({ periodFilter, statusFilter, leaseId }: PaymentListProps) {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["lease-payments", leaseId, periodFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("due_date", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (periodFilter === "current") {
        query = query.gte("due_date", new Date().toISOString())
      } else if (periodFilter === "overdue") {
        query = query.lt("due_date", new Date().toISOString())
          .eq("status", "pending")
      } else if (periodFilter === "upcoming") {
        query = query.gt("due_date", new Date().toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div 
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {payment.type === "rent" ? "Loyer" : 
                   payment.type === "deposit" ? "Caution" : 
                   "Frais d'agence"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Échéance : {format(new Date(payment.due_date), "PP", { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                <Badge 
                  variant={
                    payment.status === "paid" ? "default" : 
                    payment.status === "pending" ? "secondary" : 
                    "destructive"
                  }
                >
                  {payment.status === "paid" ? "Payé" : 
                   payment.status === "pending" ? "En attente" : 
                   "En retard"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}