import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { PaymentStatusStats } from "@/components/apartment/payment/PaymentStatusStats"
import { PaymentFilters } from "@/components/apartment/payment/PaymentFilters"
import { PaymentsList } from "@/components/apartment/payment/PaymentsList"
import { PaymentDialog } from "@/components/apartment/payment/PaymentDialog"
import { useState } from "react"
import { useLeaseQueries } from "@/components/apartment/lease/hooks/useLeaseQueries"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2, Calendar, Plus } from "lucide-react"

type PeriodFilter = "all" | "current" | "overdue" | "upcoming";
type StatusFilter = "all" | "pending" | "paid" | "late";

export default function ApartmentTenantPayments() {
  const { leaseId } = useParams<{ leaseId: string }>()
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("current")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  // Récupérer les détails du bail actuel et autres baux du locataire
  const { leases, isLoading: isLoadingLeases } = useLeaseQueries()
  const currentLease = leases.find(lease => lease.id === leaseId)
  const otherLeases = leases.filter(lease => 
    lease.tenant_id === currentLease?.tenant_id && lease.id !== leaseId
  )

  // Récupérer les paiements
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["tenant-payment-details", leaseId, periodFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("tenant_payment_details")
        .select("*")
        .eq("lease_id", leaseId)

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      switch (periodFilter) {
        case "current":
          const today = new Date()
          query = query
            .gte("period_start", format(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd"))
            .lt("period_end", format(new Date(today.getFullYear(), today.getMonth() + 1, 1), "yyyy-MM-dd"))
          break
        case "overdue":
          query = query
            .lt("due_date", new Date().toISOString())
            .neq("status", "paid")
          break
        case "upcoming":
          query = query.gt("due_date", new Date().toISOString())
          break
      }

      const { data, error } = await query.order("due_date", { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!leaseId
  })

  if (!leaseId || !currentLease) return null

  // Calculer les statistiques
  const stats = payments ? {
    total: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    paid: payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0),
    late: payments.filter(p => p.status === "late").reduce((sum, p) => sum + (p.amount || 0), 0),
  } : null

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête avec informations du bail */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {currentLease.tenant?.first_name} {currentLease.tenant?.last_name}
                </h2>
                <p className="text-muted-foreground">
                  {currentLease.unit?.apartment?.name} - Unité {currentLease.unit?.unit_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  Début du bail: {format(new Date(currentLease.start_date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Loyer</p>
                <p className="text-2xl font-bold">{currentLease.rent_amount.toLocaleString()} FCFA</p>
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

        {/* Autres baux du locataire si présents */}
        {otherLeases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Autres unités louées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {otherLeases.map(lease => (
                  <div key={lease.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {lease.unit?.apartment?.name} - Unité {lease.unit?.unit_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Depuis le {format(new Date(lease.start_date), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={`/agence/apartment-leases/${lease.id}/payments`}>
                        Voir les paiements
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques des paiements */}
        <PaymentStatusStats stats={stats} />

        {/* Filtres */}
        <PaymentFilters
          periodFilter={periodFilter}
          statusFilter={statusFilter}
          onPeriodFilterChange={setPeriodFilter}
          onStatusFilterChange={setStatusFilter}
        />

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