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
import { toast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function InitialPaymentForm({ 
  leaseId, 
  depositAmount = 0,
  rentAmount = 0,
  paymentFrequency,
  onSuccess 
}: InitialPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [firstRentDate, setFirstRentDate] = useState<Date>(new Date())
  const { handleInitialPayments } = useLeaseMutations()

  // Requête pour vérifier si first_rent_start_date existe déjà
  const { data: existingPayment } = useQuery({
    queryKey: ['first-rent-date', leaseId],
    queryFn: async () => {
      console.log("Fetching first rent date for lease:", leaseId)
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select('first_rent_start_date, payment_date')
        .eq('lease_id', leaseId)
        .eq('payment_type', 'deposit')
        .maybeSingle()

      if (error) {
        console.error("Error fetching first rent date:", error)
        return null
      }

      console.log("Existing payment data:", data)
      return data
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!depositAmount || !rentAmount) {
      toast({
        title: "Erreur",
        description: "Les montants de la caution et du loyer sont requis",
        variant: "destructive"
      })
      return
    }

    console.log("Starting initial payment submission:", {
      leaseId,
      depositAmount,
      rentAmount,
      firstRentDate: firstRentDate.toISOString(),
      paymentFrequency
    })

    setIsSubmitting(true)

    try {
      const result = await handleInitialPayments.mutateAsync({
        leaseId,
        depositAmount,
        rentAmount,
        firstRentStartDate: firstRentDate
      })

      console.log("Initial payment submission result:", result)

      // Vérifier si le paiement a été enregistré avec succès
      const { data: verifyPayment, error } = await supabase
        .from('apartment_lease_payments')
        .select('first_rent_start_date, payment_date')
        .eq('lease_id', leaseId)
        .eq('payment_type', 'deposit')
        .maybeSingle()

      console.log("Payment verification:", { verifyPayment, error })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate values outside JSX
  const agencyFees = rentAmount ? Math.round(rentAmount * 0.5) : 0
  const formattedDepositAmount = depositAmount ? depositAmount.toLocaleString() : "0"
  const formattedAgencyFees = agencyFees.toLocaleString()

  // Log when PaymentCountdown is rendered
  console.log("Rendering PaymentCountdown with:", {
    firstRentDate,
    paymentFrequency,
    existingPayment
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Caution</Label>
            <Input
              type="text"
              value={`${formattedDepositAmount} FCFA`}
              disabled
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Frais d'agence (50% du loyer)</Label>
            <Input
              type="text"
              value={`${formattedAgencyFees} FCFA`}
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

      {paymentFrequency && firstRentDate && (
        <PaymentCountdown 
          firstRentDate={firstRentDate}
          frequency={paymentFrequency}
        />
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting || !depositAmount || !rentAmount}
        className="w-full"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
      </Button>
    </form>
  )
}