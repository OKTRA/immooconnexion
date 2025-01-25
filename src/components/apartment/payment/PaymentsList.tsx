import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InitialPaymentsSection } from "./components/InitialPaymentsSection"
import { RegularPaymentsList } from "./components/RegularPaymentsList"
import { PaymentPeriodFilter, PaymentStatusFilter, PaymentsListProps } from "./types"

export function PaymentsList({ 
  periodFilter, 
  statusFilter, 
  tenantId 
}: PaymentsListProps) {
  const { toast } = useToast()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["tenant-payment-details", periodFilter, statusFilter, tenantId],
    queryFn: async () => {
      console.log("Fetching payments for tenant:", tenantId)
      
      let query = supabase
        .from("tenant_payment_details")
        .select("*")
        .eq("tenant_id", tenantId)

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

      const { data, error } = await query.order("due_date", { ascending: false })
      
      if (error) {
        console.error("Error fetching payments:", error)
        throw error
      }
      
      return data || []
    }
  })

  const handlePaymentAction = async (paymentId: string, action: string) => {
    try {
      switch (action) {
        case 'mark_as_paid':
          await supabase
            .from('apartment_lease_payments')
            .update({ 
              status: 'paid',
              payment_date: new Date().toISOString()
            })
            .eq('id', paymentId)
          
          toast({
            title: "Paiement mis à jour",
            description: "Le paiement a été marqué comme payé",
          })
          break

        case 'download_receipt':
          // Implémenter le téléchargement du reçu
          break

        case 'send_reminder':
          // Implémenter l'envoi de rappel
          break

        case 'view_details':
          // Implémenter l'affichage des détails
          break
      }
    } catch (error) {
      console.error('Error handling payment action:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InitialPaymentsSection 
        payments={payments.filter(p => p.type === 'deposit' || p.type === 'agency_fees')}
        onPaymentAction={handlePaymentAction}
      />
      <RegularPaymentsList 
        payments={payments.filter(p => p.type !== 'deposit' && p.type !== 'agency_fees')}
        onPaymentAction={handlePaymentAction}
      />
    </div>
  )
}