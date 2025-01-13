import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

interface PaymentStatsProps {
  stats: {
    total: number
    paid: number
    pending: number
    late: number
  } | null
}

export function PaymentStatusStats({ stats }: PaymentStatsProps) {
  if (!stats) return null

  const items = [
    {
      title: "Total des Paiements",
      value: stats.total.toLocaleString() + " FCFA",
      icon: CircleDollarSign,
      className: "bg-primary/10",
    },
    {
      title: "Paiements Reçus",
      value: stats.paid.toLocaleString() + " FCFA",
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-500",
    },
    {
      title: "En Attente",
      value: stats.pending.toLocaleString() + " FCFA",
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "En Retard",
      value: stats.late.toLocaleString() + " FCFA",
      icon: AlertCircle,
      className: "bg-red-500/10 text-red-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}