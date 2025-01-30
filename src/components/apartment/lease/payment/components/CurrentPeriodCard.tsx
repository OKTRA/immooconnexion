import { format, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

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
  const getPaymentProgress = () => {
    if (!currentPeriod?.payment_period_start || !currentPeriod?.payment_period_end) return 0
    const start = new Date(currentPeriod.payment_period_start)
    const end = new Date(currentPeriod.payment_period_end)
    const now = new Date()
    const totalDays = differenceInDays(end, start)
    const elapsedDays = differenceInDays(now, start)
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
  }

  const getStatusBadge = () => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'paid':
        case 'paid_current':
          return 'default'
        case 'paid_advance':
          return 'secondary'
        case 'pending':
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
        case 'late':
          return <AlertCircle className="w-4 h-4 mr-1" />
        default:
          return null
      }
    }

    return (
      <Badge 
        variant={getVariant(currentPeriod.status)}
        className="flex items-center"
      >
        {getIcon(currentPeriod.status)}
        {currentPeriod.status === 'paid' ? 'Payé' :
         currentPeriod.status === 'pending' ? 'En attente' :
         currentPeriod.status === 'late' ? 'En retard' : 
         currentPeriod.status}
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
            <span>{Math.round(getPaymentProgress())}%</span>
          </div>
          <Progress 
            value={getPaymentProgress()} 
            className="h-2"
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-semibold">
            {currentPeriod.amount.toLocaleString()} FCFA
          </span>
          {currentPeriod.status === 'pending' && (
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