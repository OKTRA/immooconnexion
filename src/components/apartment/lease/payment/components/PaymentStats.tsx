import { Card, CardContent } from "@/components/ui/card"
import { PaymentSummary } from "../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react"

interface PaymentStatsProps {
  stats: PaymentSummary
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <ArrowUpCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total reçu
              </p>
              <p className="text-2xl font-bold">
                {stats.totalReceived.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                En attente
              </p>
              <p className="text-2xl font-bold">
                {stats.pendingAmount.toLocaleString()} FCFA
              </p>
              {stats.nextPaymentDue && (
                <p className="text-sm text-muted-foreground mt-1">
                  Prochain: {format(new Date(stats.nextPaymentDue.dueDate), 'PP', { locale: fr })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                En retard
              </p>
              <p className="text-2xl font-bold">
                {stats.lateAmount.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}