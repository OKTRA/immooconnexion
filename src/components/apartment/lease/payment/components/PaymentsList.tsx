import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Payment {
  id: string;
  type: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: string;
}

interface PaymentsListProps {
  title: string;
  payments: Payment[];
}

export function PaymentsList({ title, payments }: PaymentsListProps) {
  return (
    <Card>
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
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                <Badge 
                  variant={
                    payment.status === 'paid' ? 'default' : 
                    payment.status === 'pending' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {payment.status === 'paid' ? 'Payé' : 
                   payment.status === 'pending' ? 'En attente' : 
                   'En retard'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}