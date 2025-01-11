import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface UnitPaymentHistoryProps {
  unitId: string
}

export function UnitPaymentHistory({ unitId }: UnitPaymentHistoryProps) {
  const { data: payments } = useQuery({
    queryKey: ["unit-payments", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases (
            tenant:apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("apartment_leases.unit_id", unitId)
        .order("due_date", { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (!payments?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Aucun paiement enregistré
          </p>
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
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Locataire</th>
                <th className="p-4 text-left">Montant</th>
                <th className="p-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-4">
                    {format(new Date(payment.due_date), "PP", { locale: fr })}
                  </td>
                  <td className="p-4">
                    {payment.apartment_leases?.tenant?.first_name}{" "}
                    {payment.apartment_leases?.tenant?.last_name}
                  </td>
                  <td className="p-4">
                    {payment.amount.toLocaleString()} FCFA
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={payment.status === "paid" ? "success" : "destructive"}
                    >
                      {payment.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}