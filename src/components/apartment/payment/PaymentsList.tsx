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
        .order("due_date", { ascending: false })

      // N'appliquer les filtres que pour les paiements réguliers
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (periodFilter === "current") {
        const today = new Date().toISOString().split("T")[0]
        query = query
          .lte("period_start", today)
          .gte("period_end", today)
      } else if (periodFilter === "overdue") {
        const today = new Date().toISOString().split("T")[0]
        query = query
          .lt("period_end", today)
          .neq("status", "paid")
      } else if (periodFilter === "upcoming") {
        const today = new Date().toISOString().split("T")[0]
        query = query.gt("period_start", today)
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