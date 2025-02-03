import { format, differenceInDays, differenceInHours, addMonths, addQuarters, addYears, startOfMonth, endOfMonth, isSameMonth, isAfter, isBefore } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { LeaseData, PaymentListItem } from "../types"

interface PaymentPeriod {
  startDate: Date
  endDate: Date
  amount: number
  status: 'pending' | 'due_soon' | 'late' | 'paid'
  isPaid: boolean
  paymentId?: string
}

interface PaymentTimelineProps {
  lease: LeaseData
  initialPayments: PaymentListItem[]
}

export function PaymentTimeline({ lease, initialPayments }: PaymentTimelineProps) {
  const [periods, setPeriods] = useState<PaymentPeriod[]>([])
  const [currentPeriod, setCurrentPeriod] = useState<PaymentPeriod | null>(null)

  useEffect(() => {
    const depositPayment = initialPayments.find(p => p.payment_type === 'deposit')
    const firstRentStartDate = depositPayment?.first_rent_start_date || lease.start_date
    
    const calculatePeriodEndDate = (startDate: Date, frequency: string) => {
      const date = new Date(startDate)
      switch (frequency) {
        case 'monthly':
          return new Date(date.setMonth(date.getMonth() + 1, date.getDate() - 1))
        case 'quarterly':
          return new Date(date.setMonth(date.getMonth() + 3, date.getDate() - 1))
        case 'yearly':
          return new Date(date.setFullYear(date.getFullYear() + 1, date.getMonth(), date.getDate() - 1))
        case 'biannual':
          return new Date(date.setMonth(date.getMonth() + 6, date.getDate() - 1))
        default:
          return new Date(date.setMonth(date.getMonth() + 1, date.getDate() - 1))
      }
    }
    
    // Générer les périodes jusqu'à aujourd'hui
    const generatePastPeriods = () => {
      const newPeriods: PaymentPeriod[] = []
      let currentDate = new Date(firstRentStartDate)
      const now = new Date()
      
      while (currentDate <= now) {
        const endDate = calculatePeriodEndDate(currentDate, lease.payment_frequency)

        // Ne pas ajouter la période en cours
        if (currentDate < now) {
          newPeriods.push({
            startDate: currentDate,
            endDate: endDate,
            amount: lease.rent_amount,
            status: 'pending',
            isPaid: false
          })
        }
        
        // Passer à la période suivante
        currentDate = new Date(endDate)
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return newPeriods
    }

    // Générer la période en cours
    const generateCurrentPeriod = () => {
      const now = new Date()
      const endDate = calculatePeriodEndDate(now, lease.payment_frequency)

      return {
        startDate: now,
        endDate,
        amount: lease.rent_amount,
        status: 'pending',
        isPaid: false
      }
    }

    const pastPeriods = generatePastPeriods()
    const current = generateCurrentPeriod()
    
    setPeriods(pastPeriods)
    setCurrentPeriod(current)
  }, [lease, initialPayments])

  useEffect(() => {
    // Mettre à jour les statuts toutes les heures
    const updateStatuses = () => {
      setPeriods(currentPeriods => 
        currentPeriods.map(period => {
          const now = new Date()
          const daysUntilDue = differenceInDays(period.endDate, now)
          
          if (period.isPaid) return { ...period, status: 'paid' }
          if (daysUntilDue < 0) return { ...period, status: 'late' }
          if (daysUntilDue <= 3) return { ...period, status: 'due_soon' }
          return { ...period, status: 'pending' }
        })
      )

      if (currentPeriod) {
        const now = new Date()
        const daysUntilDue = differenceInDays(currentPeriod.endDate, now)
        
        setCurrentPeriod(current => {
          if (!current) return null
          if (current.isPaid) return { ...current, status: 'paid' }
          if (daysUntilDue < 0) return { ...current, status: 'late' }
          if (daysUntilDue <= 3) return { ...current, status: 'due_soon' }
          return { ...current, status: 'pending' }
        })
      }
    }

    const interval = setInterval(updateStatuses, 3600000) // Toutes les heures
    updateStatuses() // Mise à jour initiale

    return () => clearInterval(interval)
  }, [currentPeriod])

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { icon: <CheckCircle2 className="w-4 h-4 mr-1" />, label: 'Payé', variant: 'default' },
      pending: { icon: <Clock className="w-4 h-4 mr-1" />, label: 'En attente', variant: 'secondary' },
      due_soon: { icon: <AlertTriangle className="w-4 h-4 mr-1" />, label: 'Échéance proche', variant: 'warning' },
      late: { icon: <AlertCircle className="w-4 h-4 mr-1" />, label: 'En retard', variant: 'destructive' }
    }[status]

    return (
      <Badge variant={config.variant as any} className="flex items-center">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const calculateProgress = (period: PaymentPeriod) => {
    const now = new Date()
    const total = differenceInDays(period.endDate, period.startDate)
    const elapsed = differenceInDays(now, period.startDate)
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi Chronologique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Périodes passées */}
          {periods.map((period, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Période {format(period.startDate, 'MMMM yyyy', { locale: fr })}
                  </p>
                  {getStatusBadge(period.status)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Du {format(period.startDate, 'PP', { locale: fr })} au{' '}
                  {format(period.endDate, 'PP', { locale: fr })}
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="font-semibold">
                  {period.amount.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}

          {/* Période en cours */}
          {currentPeriod && (
            <div className="flex items-center justify-between p-4 border-2 border-primary rounded-lg hover:bg-accent/5 transition-colors">
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Période en cours ({format(currentPeriod.startDate, 'MMMM yyyy', { locale: fr })})
                  </p>
                  {getStatusBadge(currentPeriod.status)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Du {format(currentPeriod.startDate, 'PP', { locale: fr })} au{' '}
                  {format(currentPeriod.endDate, 'PP', { locale: fr })}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{calculateProgress(currentPeriod).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculateProgress(currentPeriod)} />
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="font-semibold">
                  {currentPeriod.amount.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
