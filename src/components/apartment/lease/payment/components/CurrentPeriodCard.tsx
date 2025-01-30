import { format, differenceInDays, differenceInHours, addDays } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface CurrentPeriodCardProps {
  currentPeriod: {
    payment_period_start: string;
    payment_period_end: string;
    amount: number;
    status: string;
    payment_status_type?: string;
  };
  onPaymentClick: () => void;
}

export function CurrentPeriodCard({ currentPeriod, onPaymentClick }: CurrentPeriodCardProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState("")
  const [status, setStatus] = useState(currentPeriod.payment_status_type || currentPeriod.status)

  useEffect(() => {
    const updateProgress = () => {
      const start = new Date(currentPeriod.payment_period_start)
      const end = new Date(currentPeriod.payment_period_end)
      const now = new Date()
      const totalDays = differenceInDays(end, start)
      const elapsedDays = differenceInDays(now, start)
      const daysLeft = differenceInDays(end, now)
      const hoursLeft = differenceInHours(end, now) % 24

      // Calculer la progression
      const currentProgress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
      setProgress(currentProgress)

      // Mettre à jour le temps restant
      if (daysLeft > 0) {
        setTimeLeft(`${daysLeft} jour${daysLeft > 1 ? 's' : ''} et ${hoursLeft} heure${hoursLeft > 1 ? 's' : ''}`)
      } else if (daysLeft === 0 && hoursLeft > 0) {
        setTimeLeft(`${hoursLeft} heure${hoursLeft > 1 ? 's' : ''}`)
      } else {
        setTimeLeft("Délai dépassé")
      }

      // Mettre à jour le statut
      if (currentPeriod.payment_status_type === 'paid' || currentPeriod.status === 'paid') {
        setStatus('paid')
      } else if (now > end) {
        setStatus('late')
      } else if (daysLeft <= 3) {
        setStatus('due_soon')
      } else {
        setStatus('pending')
      }
    }

    // Mettre à jour immédiatement
    updateProgress()

    // Mettre à jour toutes les heures
    const interval = setInterval(updateProgress, 3600000)

    return () => clearInterval(interval)
  }, [currentPeriod])

  const getStatusBadge = () => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
          return 'default'
        case 'paid_advance':
          return 'secondary'
        case 'due_soon':
          return 'warning'
        case 'late':
          return 'destructive'
        default:
          return 'outline'
      }
    }

    const getIcon = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
        case 'paid_advance':
          return <CheckCircle2 className="w-4 h-4 mr-1" />
        case 'pending':
          return <Clock className="w-4 h-4 mr-1" />
        case 'due_soon':
          return <AlertTriangle className="w-4 h-4 mr-1" />
        case 'late':
          return <AlertCircle className="w-4 h-4 mr-1" />
        default:
          return null
      }
    }

    const getLabel = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
          return 'Payé'
        case 'paid_advance':
          return 'Payé en avance'
        case 'pending':
          return 'En attente'
        case 'due_soon':
          return 'Échéance proche'
        case 'late':
          return 'En retard'
        default:
          return status
      }
    }

    return (
      <Badge 
        variant={getVariant(status)}
        className="flex items-center"
      >
        {getIcon(status)}
        {getLabel(status)}
      </Badge>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-y-0">
          <span>Période en cours</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Du {format(new Date(currentPeriod.payment_period_start), 'PP', { locale: fr })}
          </span>
          <span>
            Au {format(new Date(currentPeriod.payment_period_end), 'PP', { locale: fr })}
          </span>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground text-center mt-1">
            {timeLeft}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-semibold">
            {currentPeriod.amount.toLocaleString()} FCFA
          </span>
          {status !== 'paid' && status !== 'paid_current' && status !== 'paid_advance' && (
            <Button
              onClick={onPaymentClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Payer maintenant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}