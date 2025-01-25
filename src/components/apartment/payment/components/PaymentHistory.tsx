import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentHistoryEntry } from "@/types/payment"
import { Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface PaymentHistoryProps {
  payments: PaymentHistoryEntry[]
  title?: string
}

export function PaymentHistory({ payments, title = "Historique des paiements" }: PaymentHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid_current':
      case 'paid_advance':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid_current':
        return 'default'
      case 'paid_advance':
        return 'secondary'
      case 'pending':
        return 'warning'
      case 'late':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid_current':
        return 'Payé'
      case 'paid_advance':
        return 'Payé en avance'
      case 'pending':
        return 'En attente'
      case 'late':
        return 'En retard'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(payment.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {payment.amount.toLocaleString()} FCFA
                    </p>
                    {payment.periodStart && payment.periodEnd && (
                      <span className="text-sm text-muted-foreground">
                        ({format(payment.periodStart, "d MMM", { locale: fr })} - {format(payment.periodEnd, "d MMM yyyy", { locale: fr })})
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(payment.date, "d MMMM yyyy", { locale: fr })}
                  </p>
                  {payment.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {payment.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={getStatusBadgeVariant(payment.status)}>
                  {getStatusLabel(payment.status)}
                </Badge>
                <span className="text-sm text-muted-foreground capitalize">
                  {payment.paymentMethod.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun paiement enregistré
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}