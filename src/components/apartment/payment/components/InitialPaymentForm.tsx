import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { ApartmentLease } from "@/types/apartment"
import { useLeaseMutations } from "@/components/apartment/lease/hooks/useLeaseMutations"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface InitialPaymentFormProps {
  onSuccess?: () => void
  lease: ApartmentLease
}

export function InitialPaymentForm({ onSuccess, lease }: InitialPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { handleInitialPayments } = useLeaseMutations()

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFirstRentDate(date)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await handleInitialPayments.mutateAsync({
        leaseId: lease.id,
        depositAmount: lease.deposit_amount,
        rentAmount: lease.rent_amount,
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
              value={`${lease.deposit_amount?.toLocaleString()} FCFA`}
              disabled
            />
          </div>

          <div>
            <Label>Frais d'agence (50% du loyer)</Label>
            <Input
              type="text"
              value={`${Math.round(lease.rent_amount * 0.5).toLocaleString()} FCFA`}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Date de début du premier loyer</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !firstRentDate && "text-muted-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsCalendarOpen(true)
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {firstRentDate ? (
                    format(firstRentDate, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div onClick={(e) => e.stopPropagation()}>
                  <Calendar
                    mode="single"
                    selected={firstRentDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={false}
                  />
                </div>
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