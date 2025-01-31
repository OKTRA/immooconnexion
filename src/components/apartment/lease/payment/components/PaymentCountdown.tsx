import { useEffect, useState } from "react"
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"
import { Clock } from "lucide-react"
import { PaymentFrequency } from "../types"

interface PaymentCountdownProps {
  firstRentDate: Date
  frequency: PaymentFrequency
}

export function PaymentCountdown({ firstRentDate, frequency }: PaymentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  })

  useEffect(() => {
    console.log("PaymentCountdown mounted with:", { firstRentDate, frequency })
    
    const updateCountdown = () => {
      const now = new Date()
      const days = differenceInDays(firstRentDate, now)
      const hours = differenceInHours(firstRentDate, now) % 24
      const minutes = differenceInMinutes(firstRentDate, now) % 60

      setTimeLeft({ days, hours, minutes })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [firstRentDate])

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'monthly':
        return 'mensuel'
      case 'quarterly':
        return 'trimestriel'
      case 'yearly':
        return 'annuel'
      default:
        return ''
    }
  }

  if (timeLeft.days < 0) {
    return null // Ne pas afficher si la date est passée
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="font-medium">
          Temps restant jusqu'au premier loyer {getFrequencyLabel()}:
        </p>
        <p className="text-lg">
          {timeLeft.days} jours, {timeLeft.hours} heures et {timeLeft.minutes} minutes
        </p>
      </div>
    </div>
  )
}