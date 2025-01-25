import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

interface PaymentStatsProps {
  stats: {
    totalReceived: number;
    pendingAmount: number;
    lateAmount: number;
    nextPayment?: {
      amount: number;
      due_date: string;
    };
  };
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Reçu
          </CardTitle>
          <CircleDollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.totalReceived?.toLocaleString()} FCFA
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            En Attente
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.pendingAmount?.toLocaleString()} FCFA
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-500/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            En Retard
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.lateAmount?.toLocaleString()} FCFA
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-500/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Prochain Paiement
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {stats?.nextPayment ? (
            <>
              <div className="text-2xl font-bold">
                {stats.nextPayment.amount.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-muted-foreground">
                Dû le {new Date(stats.nextPayment.due_date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Aucun paiement prévu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}