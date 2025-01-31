import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "../../payment/components/PaymentMethodSelect"
import { PaymentCountdown } from "../payment/components/PaymentCountdown"
import { InitialPaymentFormProps } from "../types"
import { useLeaseMutations } from "../hooks/useLeaseMutations"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentMethod } from "@/types/payment"

export function InitialPaymentForm({ 
  leaseId, 
  depositAmount, 
  rentAmount,
  paymentFrequency,
  onSuccess 
}: InitialPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date>(new Date())
  const { handleInitialPayments } = useLeaseMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await handleInitialPayments.mutateAsync({
        leaseId,
        depositAmount,
        rentAmount,
        firstRentStartDate: firstRentDate
      })
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
    } finally {
      setIsSubmitting(false)
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
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Frais d'agence (50% du loyer)</Label>
            <Input
              type="text"
              value={`${Math.round(rentAmount * 0.5).toLocaleString()} FCFA`}
              disabled
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value as PaymentMethod)}
            />
          </div>

          <div>
            <Label>Date du premier loyer</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1.5 justify-start text-left font-normal",
                    !firstRentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {firstRentDate ? format(firstRentDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={firstRentDate}
                  onSelect={(date) => date && setFirstRentDate(date)}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      <PaymentCountdown 
        firstRentDate={firstRentDate}
        frequency={paymentFrequency}
      />

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
      </Button>
    </form>
  )
}