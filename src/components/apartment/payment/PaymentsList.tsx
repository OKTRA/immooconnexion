import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InitialPaymentsSection } from "./components/InitialPaymentsSection"
import { RegularPaymentsList } from "./components/RegularPaymentsList"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentsListProps {
  periodFilter: PaymentPeriodFilter
  statusFilter: PaymentStatusFilter
  leaseId: string
}

export function PaymentsList({ 
  periodFilter, 
  statusFilter, 
  leaseId 
}: PaymentsListProps) {
  const { toast } = useToast()

  const { data: payments, isLoading } = useQuery({
    queryKey: ["tenant-payment-details", leaseId, periodFilter, statusFilter],
    queryFn: async () => {
      console.log("Fetching payments for lease:", leaseId)
      
      let query = supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases!inner (
            tenant_id,
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("lease_id", leaseId)

      // Appliquer les filtres de statut
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      // Appliquer les filtres de période
      const today = new Date()
      
      if (periodFilter === "current") {
        query = query
          .gte("payment_period_start", new Date(today.getFullYear(), today.getMonth(), 1).toISOString())
          .lt("payment_period_end", new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString())
      } else if (periodFilter === "overdue") {
        query = query
          .lt("due_date", today.toISOString())
          .neq("status", "paid")
      } else if (periodFilter === "upcoming") {
        query = query.gt("due_date", today.toISOString())
      }

      // Ordonner par date d'échéance
      query = query.order("due_date", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("Error fetching payments:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements",
          variant: "destructive",
        })
        throw error
      }
      
      console.log("Fetched payments:", data)

      // Séparer les paiements initiaux des paiements réguliers
      const initialPayments = (data || []).filter(p => 
        p.type === 'deposit' || p.type === 'agency_fees'
      )

      const regularPayments = (data || []).filter(p => 
        p.type !== 'deposit' && p.type !== 'agency_fees'
      )

      return {
        initialPayments,
        regularPayments
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!payments?.initialPayments?.length && !payments?.regularPayments?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucun paiement trouvé pour cette période
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <InitialPaymentsSection payments={payments.initialPayments} />
      <RegularPaymentsList payments={payments.regularPayments} />
    </div>
  )
}