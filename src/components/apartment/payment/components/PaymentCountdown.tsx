import { useEffect, useState } from "react"
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"
import { Clock } from "lucide-react"

interface PaymentCountdownProps {
  targetDate: Date
}

export function PaymentCountdown({ targetDate }: PaymentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const days = differenceInDays(targetDate, now)
      const hours = differenceInHours(targetDate, now) % 24
      const minutes = differenceInMinutes(targetDate, now) % 60

      setTimeLeft({ days, hours, minutes })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-4">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="font-medium">Temps restant jusqu'au premier loyer :</p>
        <p className="text-lg">
          {timeLeft.days} jours, {timeLeft.hours} heures et {timeLeft.minutes} minutes
        </p>
      </div>
    </div>
  )
}