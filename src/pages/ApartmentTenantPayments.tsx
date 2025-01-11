import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function ApartmentTenantPayments() {
  const { tenantId } = useParams<{ tenantId: string }>()

  const { data: payments, isLoading } = useQuery({
    queryKey: ["apartment-tenant-payments", tenantId],
    queryFn: async () => {
      const { data: leases, error: leaseError } = await supabase
        .from("apartment_leases")
        .select("id")
        .eq("tenant_id", tenantId)

      if (leaseError) throw leaseError

      const leaseIds = leases.map(lease => lease.id)

      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          lease:apartment_leases(
            rent_amount,
            unit:apartment_units(
              unit_number,
              apartment:apartments(name)
            )
          )
        `)
        .in("lease_id", leaseIds)
        .order("due_date", { ascending: false })

      if (paymentsError) throw paymentsError

      return payments
    },
    enabled: !!tenantId
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {payment.amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Appartement: {payment.lease.unit.apartment.name} - Unité: {payment.lease.unit.unit_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Échéance: {format(new Date(payment.due_date), "PP", { locale: fr })}
                    </p>
                  </div>
                  <Badge
                    variant={payment.status === "paid" ? "success" : "secondary"}
                  >
                    {payment.status === "paid" ? "Payé" : "En attente"}
                  </Badge>
                </div>
              ))}
              {(!payments || payments.length === 0) && (
                <p className="text-center text-muted-foreground">
                  Aucun paiement enregistré
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  )
}