import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: unitDetails, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select(`
          *,
          apartment:apartments(name),
          current_lease:apartment_leases(
            *,
            tenant:apartment_tenants(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['unit-payments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select(`
          *,
          lease:apartment_leases(
            tenant:apartment_tenants(*)
          )
        `)
        .eq('apartment_leases.unit_id', id)
        .order('due_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  const { data: lateFees, isLoading: isLoadingLateFees } = useQuery({
    queryKey: ['unit-late-fees', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('late_payment_fees')
        .select(`
          *,
          lease:apartment_leases!late_payment_fees_lease_id_fkey(
            tenant:apartment_tenants(*)
          )
        `)
        .eq('apartment_leases.unit_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['unit-notifications', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_notifications')
        .select(`
          *,
          lease:apartment_leases(
            tenant:apartment_tenants(*)
          )
        `)
        .eq('apartment_leases.unit_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  if (isLoadingUnit) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Unité {unitDetails?.unit_number} - {unitDetails?.apartment?.name}
          </h1>
          <p className="text-muted-foreground">
            Détails et historique de l'unité
          </p>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="late-fees">Pénalités</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'unité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Numéro d'unité</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.unit_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Étage</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.floor_number || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surface</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.area || "-"} m²</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Loyer</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.rent_amount?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Caution</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.deposit_amount?.toLocaleString() || "-"} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Statut</p>
                    <Badge>{unitDetails?.status}</Badge>
                  </div>
                </div>

                {unitDetails?.current_lease?.[0] && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Locataire actuel</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Nom</p>
                        <p className="text-sm text-muted-foreground">
                          {unitDetails.current_lease[0].tenant.first_name} {unitDetails.current_lease[0].tenant.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{unitDetails.current_lease[0].tenant.email || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Téléphone</p>
                        <p className="text-sm text-muted-foreground">{unitDetails.current_lease[0].tenant.phone_number || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date de début</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(unitDetails.current_lease[0].start_date), 'PP', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Historique des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : payments?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucun paiement enregistré
                  </p>
                ) : (
                  <div className="space-y-4">
                    {payments?.map(payment => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {payment.amount.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Échéance: {format(new Date(payment.due_date), 'PP', { locale: fr })}
                          </p>
                        </div>
                        <Badge variant={payment.status === 'paid' ? 'success' : 'secondary'}>
                          {payment.status === 'paid' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="late-fees">
            <Card>
              <CardHeader>
                <CardTitle>Pénalités de retard</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingLateFees ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : lateFees?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune pénalité de retard
                  </p>
                ) : (
                  <div className="space-y-4">
                    {lateFees?.map(fee => (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {fee.amount.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Jours de retard: {fee.days_late}
                          </p>
                        </div>
                        <Badge variant={fee.status === 'paid' ? 'success' : 'destructive'}>
                          {fee.status === 'paid' ? 'Payé' : 'Non payé'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingNotifications ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : notifications?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune notification
                  </p>
                ) : (
                  <div className="space-y-4">
                    {notifications?.map(notification => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {notification.type === 'late_payment' ? 'Retard de paiement' : 'Notification de paiement'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Montant: {notification.amount.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date d'échéance: {format(new Date(notification.due_date), 'PP', { locale: fr })}
                          </p>
                        </div>
                        <Badge variant={notification.is_read ? 'secondary' : 'default'}>
                          {notification.is_read ? 'Lu' : 'Non lu'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}