import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unitDetails, isLoading } = useQuery({
    queryKey: ["unit-details", id],
    queryFn: async () => {
      if (!id) throw new Error("Unit ID is required")

      const { data: unit, error: unitError } = await supabase
        .from("apartment_units")
        .select(`
          *,
          apartment:apartments(*),
          leases:apartment_leases(
            *,
            tenant:apartment_tenants(*),
            payments:apartment_lease_payments(*),
            late_fees:late_payment_fees(*)
          )
        `)
        .eq("id", id)
        .single()

      if (unitError) throw unitError

      const { data: notifications, error: notifError } = await supabase
        .from("payment_notifications")
        .select("*")
        .eq("lease_id", unit.leases?.[0]?.id)
        .order("created_at", { ascending: false })

      if (notifError) throw notifError

      return { ...unit, notifications }
    },
    enabled: !!id
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (!unitDetails) {
    return (
      <AgencyLayout>
        <div className="text-center py-8">
          Unité non trouvée
        </div>
      </AgencyLayout>
    )
  }

  const currentLease = unitDetails.leases?.[0]
  const currentTenant = currentLease?.tenant

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Unité {unitDetails.unit_number}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Appartement</p>
              <p>{unitDetails.apartment?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Étage</p>
              <p>{unitDetails.floor_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Surface</p>
              <p>{unitDetails.area || "-"} m²</p>
            </div>
            <div>
              <p className="text-sm font-medium">Loyer</p>
              <p>{unitDetails.rent_amount.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-sm font-medium">Caution</p>
              <p>{unitDetails.deposit_amount?.toLocaleString() || "-"} FCFA</p>
            </div>
            <div>
              <p className="text-sm font-medium">Statut</p>
              <Badge>{unitDetails.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {currentTenant && (
          <Card>
            <CardHeader>
              <CardTitle>Locataire actuel</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Nom</p>
                <p>{currentTenant.first_name} {currentTenant.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{currentTenant.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p>{currentTenant.phone_number || "-"}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentLease && (
          <Tabs defaultValue="payments" className="w-full">
            <TabsList>
              <TabsTrigger value="payments">Historique des paiements</TabsTrigger>
              <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentLease.payments?.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {format(new Date(payment.due_date), 'PP', { locale: fr })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {payment.amount.toLocaleString()} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
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
            </TabsContent>

            <TabsContent value="late-fees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pénalités de retard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours de retard</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentLease.late_fees?.map((fee) => (
                          <tr key={fee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {fee.days_late} jours
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {fee.amount.toLocaleString()} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={fee.status === 'paid' ? 'success' : 'warning'}>
                                {fee.status === 'paid' ? 'Payé' : 'En attente'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {unitDetails.notifications?.map((notification) => (
                          <tr key={notification.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {format(new Date(notification.created_at), 'PP', { locale: fr })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {notification.type === 'late_payment' ? 'Retard de paiement' : 'Rappel'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {notification.amount.toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AgencyLayout>
  )
}