import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TenantPaymentDetails } from "../types"

interface InitialPaymentsSectionProps {
  payments: TenantPaymentDetails[];
}

export function InitialPaymentsSection({ payments }: InitialPaymentsSectionProps) {
  const initialPayments = payments.filter(p => 
    p.type === 'deposit' || p.type === 'agency_fees'
  )

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  if (initialPayments.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Paiements Initiaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {initialPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-medium">
                    {payment.type === 'deposit' ? 'Caution' : 'Frais d\'agence'}
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
                    payment.status === 'paid'
                      ? 'success'
                      : payment.status === 'pending'
                      ? 'warning'
                      : 'destructive'
                  }
                >
                  {payment.status === 'paid'
                    ? 'Payé'
                    : payment.status === 'pending'
                    ? 'En attente'
                    : 'En retard'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}