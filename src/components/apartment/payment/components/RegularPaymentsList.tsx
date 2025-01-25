import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { PaymentActions } from "./PaymentActions"

interface RegularPaymentsListProps {
  payments: any[]
}

export function RegularPaymentsList({ payments }: RegularPaymentsListProps) {
  if (payments.length === 0) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Paiements des loyers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {payment.amount?.toLocaleString()} FCFA
                  </p>
                  {payment.payment_period_start && payment.payment_period_end && (
                    <span className="text-sm text-muted-foreground">
                      ({format(new Date(payment.payment_period_start), "d MMM", { locale: fr })} - {format(new Date(payment.payment_period_end), "d MMM yyyy", { locale: fr })})
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Échéance : {payment.due_date && format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
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
                <PaymentActions payment={payment} onAction={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}