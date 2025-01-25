import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, Phone, Mail, Home } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PaymentStatusStats } from "@/components/apartment/payment/PaymentStatusStats"
import { PaymentFilters } from "@/components/apartment/payment/PaymentFilters"
import { PaymentsList } from "@/components/apartment/payment/PaymentsList"
import { PaymentDialog } from "@/components/apartment/payment/PaymentDialog"
import { useLeaseQueries } from "@/components/apartment/lease/hooks/useLeaseQueries"
import { PaymentPeriodFilter, PaymentStatusFilter } from "@/components/apartment/payment/types"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ApartmentTenantPayments() {
  const { leaseId } = useParams<{ leaseId: string }>()
  const [periodFilter, setPeriodFilter] = useState<PaymentPeriodFilter>("current")
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  // Récupérer les détails du bail actuel
  const { leases, isLoading: isLoadingLeases } = useLeaseQueries()
  const currentLease = leases.find(lease => lease.id === leaseId)

  // Récupérer les statistiques de paiement
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["tenant-payment-stats", leaseId],
    queryFn: async () => {
      console.log("Fetching payment stats for lease:", leaseId)
      
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status")
        .eq("lease_id", leaseId)

      if (error) {
        console.error("Error fetching payment stats:", error)
        throw error
      }

      return {
        total: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        paid: payments?.filter(p => p.status === "paid")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        pending: payments?.filter(p => p.status === "pending")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        late: payments?.filter(p => p.status === "late")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      }
    },
    enabled: !!leaseId
  })

  if (!leaseId || !currentLease) return null

  const tenant = currentLease.tenant
  const unit = currentLease.unit

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête avec informations du locataire */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {tenant?.first_name?.[0]}{tenant?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">
                    {tenant?.first_name} {tenant?.last_name}
                  </h2>
                  <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>{unit?.apartment?.name} - Unité {unit?.unit_number}</span>
                    </div>
                    {tenant?.phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{tenant.phone_number}</span>
                      </div>
                    )}
                    {tenant?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{tenant.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Loyer mensuel</p>
                <p className="text-2xl font-bold">{currentLease.rent_amount?.toLocaleString()} FCFA</p>
                <p className="text-sm text-muted-foreground">
                  Début du bail: {format(new Date(currentLease.start_date), "d MMMM yyyy", { locale: fr })}
                </p>
                {currentLease.initial_payments_completed && (
                  <Button 
                    onClick={() => setIsPaymentDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau paiement
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistiques des paiements */}
        <PaymentStatusStats stats={stats} />

        {/* Filtres */}
        <Card>
          <CardContent className="p-6">
            <PaymentFilters
              periodFilter={periodFilter}
              statusFilter={statusFilter}
              onPeriodFilterChange={setPeriodFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </CardContent>
        </Card>

        {/* Liste des paiements */}
        <PaymentsList
          periodFilter={periodFilter}
          statusFilter={statusFilter}
          leaseId={leaseId}
        />

        {/* Dialog pour nouveau paiement */}
        <PaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          leaseId={leaseId}
        />
      </div>
    </AgencyLayout>
  )
}