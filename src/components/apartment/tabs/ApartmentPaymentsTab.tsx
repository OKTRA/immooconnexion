import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface ApartmentPaymentsTabProps {
  apartmentId: string
}

export function ApartmentPaymentsTab({ apartmentId }: ApartmentPaymentsTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["apartment-payments", apartmentId],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases!inner (
            tenant_id,
            unit_id,
            apartment_units!inner (
              apartment_id,
              unit_number
            ),
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("apartment_leases.apartment_units.apartment_id", apartmentId)
        .order("due_date", { ascending: false })

      if (error) throw error
      return payments
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {payment.amount.toLocaleString()} FCFA - Unité {payment.apartment_leases.apartment_units.unit_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.apartment_leases.apartment_tenants.first_name} {payment.apartment_leases.apartment_tenants.last_name}
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
            {!data?.length && (
              <p className="text-center text-muted-foreground">
                Aucun paiement enregistré
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}