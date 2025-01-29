import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { LeaseHeader } from "./components/LeaseHeader"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentsList } from "./components/PaymentsList"
import { PaymentForm } from "./PaymentForm"
import { useState } from "react"
import { LeasePaymentViewProps, LeaseData } from "./types"
import { toast } from "@/components/ui/use-toast"

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showInitialPaymentForm, setShowInitialPaymentForm] = useState(false)

  const { data: lease, isLoading } = useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lease_details")
        .select(`
          *,
          tenant:apartment_tenants(
            id,
            first_name,
            last_name,
            phone_number
          ),
          unit:apartment_units(
            id,
            unit_number,
            apartment:apartments(
              id,
              name
            )
          )
        `)
        .eq("id", leaseId)
        .single()

      if (error) {
        console.error("Error fetching lease:", error)
        throw error
      }

      return data as LeaseData
    },
  })

  const { data: stats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status")
        .eq("lease_id", leaseId)

      if (error) {
        console.error("Error fetching payment stats:", error)
        throw error
      }

      const totalReceived = payments
        ?.filter(p => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const pendingAmount = payments
        ?.filter(p => p.status === "pending")
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const lateAmount = payments
        ?.filter(p => p.status === "late")
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      return {
        totalReceived,
        pendingAmount,
        lateAmount
      }
    }
  })

  if (isLoading || !lease) {
    return <div>Loading...</div>
  }

  const handleInitialPayment = () => {
    setShowInitialPaymentForm(true)
    setShowPaymentForm(false)
  }

  const handleRegularPayment = () => {
    setShowPaymentForm(true)
    setShowInitialPaymentForm(false)
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Succès",
      description: "Le paiement a été enregistré avec succès",
    })
    setShowPaymentForm(false)
    setShowInitialPaymentForm(false)
  }

  return (
    <div className="space-y-6">
      <LeaseHeader 
        lease={lease}
        onInitialPayment={handleInitialPayment}
      />

      {stats && <PaymentStats stats={stats} />}

      {showPaymentForm && (
        <Card>
          <CardContent className="pt-6">
            <PaymentForm
              lease={lease}
              leaseId={leaseId}
              onSuccess={handlePaymentSuccess}
            />
          </CardContent>
        </Card>
      )}

      <PaymentsList
        title="Historique des paiements"
        payments={lease.regularPayments || []}
      />
    </div>
  )
}