import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { StatCard } from "@/components/StatCard"

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
      className: "bg-green-500/10",
      iconClassName: "text-green-500"
    },
    {
      title: "En Attente",
      value: stats.pending.toLocaleString() + " FCFA",
      icon: Clock,
      className: "bg-yellow-500/10",
      iconClassName: "text-yellow-500"
    },
    {
      title: "En Retard",
      value: stats.late.toLocaleString() + " FCFA",
      icon: AlertCircle,
      className: "bg-red-500/10",
      iconClassName: "text-red-500"
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          className={item.className}
          iconClassName={item.iconClassName}
        />
      ))}
    </div>
  )
}