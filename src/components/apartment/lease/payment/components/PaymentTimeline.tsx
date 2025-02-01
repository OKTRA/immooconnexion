import { format, differenceInDays, differenceInHours } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface PaymentPeriod {
  startDate: Date
  endDate: Date
  amount: number
  status: 'pending' | 'due_soon' | 'late' | 'paid'
  isPaid: boolean
  paymentId?: string
}

interface PaymentTimelineProps {
  lease: {
    id: string
    rent_amount: number
    payment_frequency: string
    start_date: string
  }
  initialPayments: any[]
}

export function PaymentTimeline({ lease, initialPayments }: PaymentTimelineProps) {
  const [periods, setPeriods] = useState<PaymentPeriod[]>([])

  useEffect(() => {
    const depositPayment = initialPayments.find(p => p.payment_type === 'deposit')
    const firstRentStartDate = depositPayment?.first_rent_start_date || lease.start_date
    
    // Générer 12 périodes à partir de la date de début
    const generatePeriods = () => {
      const newPeriods: PaymentPeriod[] = []
      let currentDate = new Date(firstRentStartDate)
      
      for (let i = 0; i < 12; i++) {
        let endDate = new Date(currentDate)
        
        // Calculer la date de fin selon la fréquence
        switch (lease.payment_frequency) {
          case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1)
            break
          case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3)
            break
          case 'yearly':
            endDate.setFullYear(endDate.getFullYear() + 1)
            break
          default:
            endDate.setMonth(endDate.getMonth() + 1)
        }
        
        newPeriods.push({
          startDate: new Date(currentDate),
          endDate: new Date(endDate),
          amount: lease.rent_amount,
          status: 'pending',
          isPaid: false
        })
        
        currentDate = new Date(endDate)
      }
      
      return newPeriods
    }

    setPeriods(generatePeriods())
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
    }

    const interval = setInterval(updateStatuses, 3600000) // Toutes les heures
    updateStatuses() // Mise à jour initiale

    return () => clearInterval(interval)
  }, [])

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi Chronologique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {periods.map((period, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Période {index + 1}
                  </p>
                  {getStatusBadge(period.status)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Du {format(period.startDate, 'PP', { locale: fr })} au{' '}
                  {format(period.endDate, 'PP', { locale: fr })}
                </div>

                {!period.isPaid && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>
                        {Math.min(
                          100,
                          Math.max(
                            0,
                            (differenceInDays(new Date(), period.startDate) /
                              differenceInDays(period.endDate, period.startDate)) *
                              100
                          )
                        ).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(
                        100,
                        Math.max(
                          0,
                          (differenceInDays(new Date(), period.startDate) /
                            differenceInDays(period.endDate, period.startDate)) *
                            100
                        )
                      )} 
                    />
                  </div>
                )}
              </div>
              
              <div className="text-right ml-4">
                <p className="font-semibold">
                  {period.amount.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}