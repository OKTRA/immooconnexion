import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentActions } from "./PaymentActions"

interface RegularPaymentsListProps {
  payments: any[]
}

export function RegularPaymentsList({ payments }: RegularPaymentsListProps) {
  if (payments.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiements réguliers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">
                    {payment.amount?.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.due_date && format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
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