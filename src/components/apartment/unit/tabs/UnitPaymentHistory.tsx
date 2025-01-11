import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface UnitPaymentHistoryProps {
  unitId: string;
}

export function UnitPaymentHistory({ unitId }: UnitPaymentHistoryProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["unit-payments", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases (
            tenant_id,
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("unit_id", unitId)
        .order("due_date", { ascending: false })

      if (error) throw error
      return data
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Payé</Badge>
      case "pending":
        return <Badge variant="warning">En attente</Badge>
      case "late":
        return <Badge variant="destructive">En retard</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  if (!payments?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucun paiement enregistré</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  {payment.apartment_leases?.apartment_tenants?.first_name} {payment.apartment_leases?.apartment_tenants?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Échéance : {format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}