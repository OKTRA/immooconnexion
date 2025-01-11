import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface TenantLeaseTabProps {
  tenant: any
}

export function TenantLeaseTab({ tenant }: TenantLeaseTabProps) {
  const { data: payments } = useQuery({
    queryKey: ["tenant-payments", tenant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", tenant.apartment_leases?.[0]?.id)
        .order("due_date", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!tenant.apartment_leases?.[0]?.id
  })

  const currentLease = tenant.apartment_leases?.[0]

  if (!currentLease) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Aucun bail actif</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bail actuel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date de début</p>
              <p className="font-medium">
                {format(new Date(currentLease.start_date), 'PP', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de fin</p>
              <p className="font-medium">
                {currentLease.end_date 
                  ? format(new Date(currentLease.end_date), 'PP', { locale: fr })
                  : 'Indéterminée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyer mensuel</p>
              <p className="font-medium">
                {currentLease.rent_amount.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Caution</p>
              <p className="font-medium">
                {currentLease.deposit_amount?.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Date d'échéance</th>
                  <th className="p-4 text-left">Montant</th>
                  <th className="p-4 text-left">Date de paiement</th>
                  <th className="p-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-4">
                      {format(new Date(payment.due_date), 'PP', { locale: fr })}
                    </td>
                    <td className="p-4">
                      {payment.amount.toLocaleString()} FCFA
                    </td>
                    <td className="p-4">
                      {payment.payment_date 
                        ? format(new Date(payment.payment_date), 'PP', { locale: fr })
                        : '-'}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={payment.status === 'paid' ? 'default' : 'destructive'}
                      >
                        {payment.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}