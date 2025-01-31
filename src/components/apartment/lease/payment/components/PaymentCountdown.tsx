import { format, addDays, addWeeks, addMonths, addQuarters, addYears } from "date-fns"
import { fr } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays } from "lucide-react"
import { PaymentFrequency } from "../types"

interface PaymentCountdownProps {
  firstRentDate: Date
  frequency: PaymentFrequency
}

export function PaymentCountdown({ firstRentDate, frequency }: PaymentCountdownProps) {
  const getNextPaymentDate = (date: Date, freq: PaymentFrequency) => {
    switch (freq) {
      case 'daily':
        return addDays(date, 1)
      case 'weekly':
        return addWeeks(date, 1)
      case 'monthly':
        return addMonths(date, 1)
      case 'quarterly':
        return addQuarters(date, 1)
      case 'yearly':
        return addYears(date, 1)
      default:
        return date
    }
  }

  const nextPaymentDate = getNextPaymentDate(firstRentDate, frequency)

  return (
    <Alert>
      <CalendarDays className="h-4 w-4" />
      <AlertDescription>
        Prochain paiement prévu le {format(nextPaymentDate, "PPP", { locale: fr })}
      </AlertDescription>
    </Alert>
  )
}