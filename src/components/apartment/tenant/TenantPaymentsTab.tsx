import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useTenantPayments } from "@/hooks/use-tenant-payments"
import { Loader2, Plus } from "lucide-react"
import { PaymentDialog } from "@/components/apartment/payment/PaymentDialog"
import { useParams } from "react-router-dom"

export function TenantPaymentsTab() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const { data, isLoading } = useTenantPayments(tenantId)

  if (!tenantId) return null

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paiements</h2>
        <Button onClick={() => setShowPaymentDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {payment.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Échéance: {format(new Date(payment.due_date), "PP", { locale: fr })}
                  </p>
                </div>
                <Badge
                  variant={payment.status === "paid" ? "success" : "secondary"}
                >
                  {payment.status === "paid" ? "Payé" : "En attente"}
                </Badge>
              </div>
            ))}
            {data.payments.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucun paiement enregistré
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pénalités de retard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.lateFees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {fee.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jours de retard: {fee.days_late}
                  </p>
                </div>
                <Badge
                  variant={fee.status === "paid" ? "success" : "destructive"}
                >
                  {fee.status === "paid" ? "Payé" : "Non payé"}
                </Badge>
              </div>
            ))}
            {data.lateFees.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucune pénalité de retard
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <PaymentDialog 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}
        tenantId={tenantId}
      />
    </div>
  )
}