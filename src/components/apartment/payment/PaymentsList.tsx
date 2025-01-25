import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InitialPaymentsSection } from "./components/InitialPaymentsSection"
import { RegularPaymentsList } from "./components/RegularPaymentsList"
import { PaymentPeriodFilter, PaymentStatusFilter, PaymentListProps } from "./types"
import { Card, CardContent } from "@/components/ui/card"

export function PaymentsList({ 
  periodFilter, 
  statusFilter, 
  leaseId 
}: PaymentListProps) {
  const { toast } = useToast()

  const { data: payments, isLoading } = useQuery({
    queryKey: ["tenant-payment-details", leaseId, periodFilter, statusFilter],
    queryFn: async () => {
      console.log("Fetching payments for lease:", leaseId)
      
      let query = supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          lease:apartment_leases!inner(
            tenant_id,
            tenant:apartment_tenants(
              first_name,
              last_name
            )
          )
        `)
        .eq("lease_id", leaseId)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

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

      // Séparer les paiements initiaux des paiements réguliers
      const initialPayments = (data || []).filter(p => 
        p.type === 'deposit' || p.type === 'agency_fees'
      )

      const regularPayments = (data || []).filter(p => 
        p.type !== 'deposit' && p.type !== 'agency_fees'
      )

      console.log("Fetched payments:", { initialPayments, regularPayments })

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