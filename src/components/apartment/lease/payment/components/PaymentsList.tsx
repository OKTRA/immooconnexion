import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentListProps } from "@/components/apartment/payment/types"

export function PaymentsList({ title, payments, className }: PaymentListProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
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
      case 'paid':
      case 'paid_current':
        return 'Payé'
      case 'paid_advance':
        return 'Payé en avance'
      case 'pending':
        return 'En attente'
      case 'late':
        return 'En retard'
      default:
        return status
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments?.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  {payment.type === 'deposit' ? 'Caution' : 
                   payment.type === 'agency_fees' ? 'Frais d\'agence' : 
                   'Loyer'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.due_date), 'PP', { locale: fr })}
                  {payment.payment_period_start && payment.payment_period_end && (
                    <span className="ml-2">
                      (Période: {format(new Date(payment.payment_period_start), 'PP', { locale: fr })} - 
                      {format(new Date(payment.payment_period_end), 'PP', { locale: fr })})
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                <Badge 
                  variant={getStatusBadgeVariant(payment.displayStatus || payment.status)}
                >
                  {getStatusLabel(payment.displayStatus || payment.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}