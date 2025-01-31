import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelect } from "../../payment/components/PaymentMethodSelect"
import { PaymentCountdown } from "../payment/components/PaymentCountdown"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { PaymentFrequency } from "../types"

interface InitialPaymentFormProps {
  depositAmount: number
  agencyFees: number
  paymentFrequency: PaymentFrequency
  onSubmit: (firstRentDate: Date) => void
  isSubmitting?: boolean
}

export function InitialPaymentForm({
  depositAmount,
  agencyFees,
  paymentFrequency,
  onSubmit,
  isSubmitting
}: InitialPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date | null>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (firstRentDate) {
      onSubmit(firstRentDate)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Caution</Label>
            <Input
              type="text"
              value={`${depositAmount?.toLocaleString()} FCFA`}
              disabled
            />
          </div>

          <div>
            <Label>Frais d'agence</Label>
            <Input
              type="text"
              value={`${agencyFees?.toLocaleString()} FCFA`}
              disabled
            />
          </div>

          <div>
            <Label>Date de début du premier loyer</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !firstRentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {firstRentDate ? (
                    format(firstRentDate, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={firstRentDate}
                  onSelect={setFirstRentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
        </div>
      </Card>

      <PaymentCountdown 
        firstRentDate={firstRentDate}
        frequency={paymentFrequency}
      />

      <Button 
        type="submit" 
        disabled={isSubmitting || !firstRentDate}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
      </Button>
    </form>
  )
}