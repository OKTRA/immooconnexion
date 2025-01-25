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
import { StatCard } from "@/components/StatCard"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import { useState } from "react"

type PeriodFilter = "current" | "previous" | "next" | "custom";
type StatusFilter = "all" | "paid" | "pending" | "late";
type TypeFilter = "all" | "rent" | "deposit" | "agency_fees";

export default function ApartmentTenantPayments() {
  const { leaseId } = useParams<{ leaseId: string }>()
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("current")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")

  // Fetch lease and tenant details
  const { data: leaseDetails } = useQuery({
    queryKey: ["lease-details", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          apartment_tenants (
            first_name,
            last_name
          ),
          apartment_units (
            unit_number,
            apartment:apartments (
              name
            )
          )
        `)
        .eq("id", leaseId)
        .single()

      if (error) throw error
      return data
    }
  })

  // Fetch payments
  const { data: payments } = useQuery({
    queryKey: ["tenant-payments", leaseId, periodFilter, statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("tenant_payment_details")
        .select("*")
        .eq("lease_id", leaseId)

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter)
      }

      // Apply period filter
      const today = new Date()
      switch (periodFilter) {
        case "current":
          query = query.gte("due_date", format(today, "yyyy-MM-01"))
            .lt("due_date", format(new Date(today.getFullYear(), today.getMonth() + 1, 1), "yyyy-MM-dd"))
          break
        case "previous":
          query = query.gte("due_date", format(new Date(today.getFullYear(), today.getMonth() - 1, 1), "yyyy-MM-dd"))
            .lt("due_date", format(today, "yyyy-MM-01"))
          break
        case "next":
          query = query.gte("due_date", format(new Date(today.getFullYear(), today.getMonth() + 1, 1), "yyyy-MM-dd"))
            .lt("due_date", format(new Date(today.getFullYear(), today.getMonth() + 2, 1), "yyyy-MM-dd"))
          break
      }

      const { data, error } = await query.order("due_date", { ascending: false })
      if (error) throw error
      return data
    }
  })

  // Calculate stats
  const stats = payments ? {
    total: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    paid: payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0),
    late: payments.filter(p => p.status === "late").reduce((sum, p) => sum + (p.amount || 0), 0),
    nextPayment: payments?.find(p => p.status === "pending")
  } : null

  // Separate initial and regular payments
  const initialPayments = payments?.filter(p => p.type === "deposit" || p.type === "agency_fees") || []
  const regularPayments = payments?.filter(p => p.type === "rent") || []

  if (!leaseId || !leaseDetails) return null

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {leaseDetails.apartment_tenants.first_name} {leaseDetails.apartment_tenants.last_name}
                </h2>
                <p className="text-muted-foreground">
                  {leaseDetails.apartment_units.apartment.name} - Unité {leaseDetails.apartment_units.unit_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  Début du bail: {format(new Date(leaseDetails.start_date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Loyer mensuel</p>
                <p className="text-2xl font-bold">{leaseDetails.rent_amount.toLocaleString()} FCFA</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* KPI Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total des paiements"
            value={`${stats?.total.toLocaleString()} FCFA`}
            icon={CircleDollarSign}
            className="bg-primary/10"
          />
          <StatCard
            title="Paiements reçus"
            value={`${stats?.paid.toLocaleString()} FCFA`}
            icon={CheckCircle2}
            className="bg-green-500/10"
            iconClassName="text-green-500"
          />
          <StatCard
            title="En attente"
            value={`${stats?.pending.toLocaleString()} FCFA`}
            icon={Clock}
            className="bg-yellow-500/10"
            iconClassName="text-yellow-500"
          />
          <StatCard
            title="En retard"
            value={`${stats?.late.toLocaleString()} FCFA`}
            icon={AlertCircle}
            className="bg-red-500/10"
            iconClassName="text-red-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période
            </label>
            <Select value={periodFilter} onValueChange={(value: PeriodFilter) => setPeriodFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Ce mois</SelectItem>
                <SelectItem value="previous">Mois précédent</SelectItem>
                <SelectItem value="next">Mois prochain</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={typeFilter} onValueChange={(value: TypeFilter) => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="rent">Loyer</SelectItem>
                <SelectItem value="deposit">Caution</SelectItem>
                <SelectItem value="agency_fees">Frais d'agence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Initial Payments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Paiements Initiaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">
                        {payment.type === "deposit" ? "Caution" : "Frais d'agence"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.due_date && format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">
                      {payment.amount?.toLocaleString()} FCFA
                    </p>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "success"
                          : payment.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {payment.status === "paid"
                        ? "Payé"
                        : payment.status === "pending"
                        ? "En attente"
                        : "En retard"}
                    </Badge>
                    {payment.status !== "paid" && (
                      <Button size="sm" variant="outline">
                        Marquer comme payé
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regular Payments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Paiements de Loyer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regularPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      Loyer - {format(new Date(payment.due_date), "MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Échéance: {format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">
                      {payment.amount?.toLocaleString()} FCFA
                    </p>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "success"
                          : payment.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {payment.status === "paid"
                        ? "Payé"
                        : payment.status === "pending"
                        ? "En attente"
                        : "En retard"}
                    </Badge>
                    {payment.status !== "paid" && (
                      <Button size="sm" variant="outline">
                        Marquer comme payé
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  )
}