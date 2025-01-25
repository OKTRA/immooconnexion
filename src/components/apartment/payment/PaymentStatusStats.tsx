import { CircleDollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { cn } from "@/lib/utils"

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
      description: "Montant total des paiements",
      className: "bg-primary/10 hover:bg-primary/20 transition-colors",
    },
    {
      title: "Paiements Reçus",
      value: stats.paid.toLocaleString() + " FCFA",
      icon: CheckCircle2,
      description: "Paiements déjà effectués",
      className: "bg-green-500/10 hover:bg-green-500/20 transition-colors",
      iconClassName: "text-green-500"
    },
    {
      title: "En Attente",
      value: stats.pending.toLocaleString() + " FCFA",
      icon: Clock,
      description: "Paiements à venir",
      className: "bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors",
      iconClassName: "text-yellow-500"
    },
    {
      title: "En Retard",
      value: stats.late.toLocaleString() + " FCFA",
      icon: AlertCircle,
      description: "Paiements en retard",
      className: cn(
        "bg-red-500/10 hover:bg-red-500/20 transition-colors",
        stats.late > 0 && "animate-pulse"
      ),
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
          description={item.description}
          className={item.className}
          iconClassName={item.iconClassName}
        />
      ))}
    </div>
  )
}