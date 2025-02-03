import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { PaymentListItem } from "../types"

interface PaymentTimelineProps {
  payments: PaymentListItem[];
}

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paid_current':
      case 'paid_advance':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'late':
      case 'paid_late':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paid_current':
        return 'Payé';
      case 'paid_advance':
        return 'Payé en avance';
      case 'pending':
        return 'En attente';
      case 'late':
        return 'En retard';
      case 'paid_late':
        return 'Payé en retard';
      default:
        return status;
    }
  }

  return (
    <div className="space-y-8">
      {payments.map((payment) => (
        <div key={payment.id} className="relative pl-8">
          <div className={`absolute left-0 w-4 h-4 rounded-full ${getStatusColor(payment.payment_status_type || payment.status)}`} />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {format(new Date(payment.payment_date || payment.due_date), 'PP', { locale: fr })}
                </span>
                <Badge variant={payment.payment_status_type === 'paid' ? 'default' : 'secondary'}>
                  {getStatusLabel(payment.payment_status_type || payment.status)}
                </Badge>
              </div>
              <span className="font-bold">
                {payment.amount.toLocaleString()} FCFA
              </span>
            </div>
            {payment.payment_period_start && payment.payment_period_end && (
              <p className="text-sm text-muted-foreground">
                Période: {format(new Date(payment.payment_period_start), 'PP', { locale: fr })} - {format(new Date(payment.payment_period_end), 'PP', { locale: fr })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}