import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { usePaymentCountdown } from "../hooks/usePaymentCountdown"
import { PaymentFrequency } from "../../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PaymentCountdownProps {
  firstRentDate: Date | null;
  frequency: PaymentFrequency;
}

export function PaymentCountdown({ firstRentDate, frequency }: PaymentCountdownProps) {
  const timeLeft = usePaymentCountdown(firstRentDate, frequency)
  
  if (!firstRentDate || !timeLeft) return null
  
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">Prochain paiement</h3>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          Premier loyer le {format(firstRentDate, "d MMMM yyyy", { locale: fr })}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-background rounded-lg p-2">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-xs text-muted-foreground">jours</div>
          </div>
          <div className="bg-background rounded-lg p-2">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs text-muted-foreground">heures</div>
          </div>
          <div className="bg-background rounded-lg p-2">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}