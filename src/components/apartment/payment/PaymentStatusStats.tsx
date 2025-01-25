import { Card } from "@/components/ui/card"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

interface PaymentStatsProps {
  stats: {
    totalReceived: number;
    pendingAmount: number;
    latePayments: number;
    nextPaymentDue?: {
      amount: number;
      dueDate: string;
    };
  };
}

export function PaymentStatusStats({ stats }: PaymentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4 bg-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Reçu</p>
            <p className="text-2xl font-bold">
              {stats.totalReceived.toLocaleString()} FCFA
            </p>
          </div>
          <CircleDollarSign className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-4 bg-yellow-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">En Attente</p>
            <p className="text-2xl font-bold">
              {stats.pendingAmount.toLocaleString()} FCFA
            </p>
          </div>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>

      <Card className="p-4 bg-red-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">En Retard</p>
            <p className="text-2xl font-bold">
              {stats.latePayments.toLocaleString()} FCFA
            </p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-4 bg-green-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Prochain Paiement</p>
            {stats.nextPaymentDue ? (
              <>
                <p className="text-2xl font-bold">
                  {stats.nextPaymentDue.amount.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  Dû le {new Date(stats.nextPaymentDue.dueDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun paiement prévu
              </p>
            )}
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
      </Card>
    </div>
  )
}