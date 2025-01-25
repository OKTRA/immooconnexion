import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, DollarSign, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { InitialPaymentsSectionProps } from "../types"

export function InitialPaymentsSection({ payments }: InitialPaymentsSectionProps) {
  if (!payments?.length) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      default:
        return 'destructive'
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Caution'
      case 'agency_fees':
        return 'Frais d\'agence'
      default:
        return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé'
      case 'pending':
        return 'En attente'
      default:
        return 'En retard'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Paiements Initiaux
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
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getPaymentTypeLabel(payment.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {payment.payment_date 
                        ? format(new Date(payment.payment_date), "d MMMM yyyy", { locale: fr })
                        : format(new Date(payment.due_date), "d MMMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {payment.amount?.toLocaleString()} FCFA
                  </span>
                </div>
                <Badge variant={getStatusBadgeVariant(payment.status)}>
                  {getStatusLabel(payment.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}