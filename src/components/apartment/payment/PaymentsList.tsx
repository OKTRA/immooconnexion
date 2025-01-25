import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InitialPaymentsSection } from "./components/InitialPaymentsSection"
import { RegularPaymentsList } from "./components/RegularPaymentsList"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"

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

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["tenant-payment-details", periodFilter, statusFilter, leaseId],
    queryFn: async () => {
      console.log("Fetching payments for lease:", leaseId)
      
      let query = supabase
        .from("tenant_payment_details")
        .select("*")
        .eq("lease_id", leaseId)

      // Appliquer les filtres de statut
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      // Appliquer les filtres de période
      const today = new Date()
      
      if (periodFilter === "current") {
        query = query
          .gte("period_start", today.toISOString())
          .lte("period_end", today.toISOString())
      } else if (periodFilter === "overdue") {
        query = query
          .lt("due_date", today.toISOString())
          .neq("status", "paid")
      } else if (periodFilter === "upcoming") {
        query = query
          .gt("period_start", today.toISOString())
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
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Séparer les paiements initiaux des paiements réguliers
  const initialPayments = payments.filter(p => 
    p.type === 'deposit' || p.type === 'agency_fees'
  )

  const regularPayments = payments.filter(p => 
    p.type !== 'deposit' && p.type !== 'agency_fees'
  )

  return (
    <div className="space-y-6">
      <InitialPaymentsSection payments={initialPayments} />
      <RegularPaymentsList payments={regularPayments} />
    </div>
  )
}