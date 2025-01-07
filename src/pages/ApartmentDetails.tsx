import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Separator } from "@/components/ui/separator"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartmentDetails } from "@/hooks/use-apartment-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentNotifications } from "@/components/admin/dashboard/AdminNotifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const {
    apartment,
    apartmentLoading,
    units,
    unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentDetails(id)

  const { data: latePayments = [] } = useQuery({
    queryKey: ["late-payments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("late_payment_fees")
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
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: Boolean(id)
  })

  const { data: deposits = [] } = useQuery({
    queryKey: ["deposits", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          apartment_tenants (
            first_name,
            last_name
          )
        `)
        .eq('status', 'expired')
        .is('deposit_returned', false)
        .order('end_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: Boolean(id)
  })

  if (!id) return null

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
      />
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="units">Unités</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="late-fees">Pénalités de retard</TabsTrigger>
          <TabsTrigger value="deposits">Cautions</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          {apartment && <ApartmentInfo apartment={apartment} />}
        </TabsContent>

        <TabsContent value="units">
          <ApartmentUnitsSection
            apartmentId={id}
            units={units}
            isLoading={unitsLoading}
            onCreateUnit={(data) => createUnit.mutateAsync(data)}
            onUpdateUnit={(data) => updateUnit.mutateAsync(data)}
            onDeleteUnit={(unitId) => deleteUnit.mutateAsync(unitId)}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentNotifications />
        </TabsContent>

        <TabsContent value="late-fees">
          <Card>
            <CardHeader>
              <CardTitle>Pénalités de retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latePayments.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {fee.apartment_leases?.apartment_tenants?.first_name}{' '}
                        {fee.apartment_leases?.apartment_tenants?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Montant: {fee.amount.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Jours de retard: {fee.days_late}
                      </p>
                    </div>
                    <Badge variant={fee.status === "paid" ? "success" : "secondary"}>
                      {fee.status}
                    </Badge>
                  </div>
                ))}
                {latePayments.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    Aucune pénalité de retard
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des cautions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deposits.map((lease) => (
                  <div
                    key={lease.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {lease.apartment_tenants?.first_name}{' '}
                        {lease.apartment_tenants?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Caution: {lease.deposit_amount?.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fin du bail: {format(new Date(lease.end_date), "PPp", { locale: fr })}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      En attente de remboursement
                    </Badge>
                  </div>
                ))}
                {deposits.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    Aucune caution à rembourser
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AgencyLayout>
  )
}