import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaymentCountdown } from "./PaymentCountdown"
import { useLeaseMutations } from "../hooks/useLeaseMutations"
import { toast } from "@/components/ui/use-toast"

interface InitialPaymentFormProps {
  leaseId: string
  depositAmount: number
  rentAmount: number
  onSuccess?: () => void
}

export function InitialPaymentForm({ 
  leaseId, 
  depositAmount, 
  rentAmount,
  onSuccess 
}: InitialPaymentFormProps) {
  const [date, setDate] = useState<Date>()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const { handleInitialPayments } = useLeaseMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour le premier loyer",
        variant: "destructive"
      })
      return
    }

    try {
      await handleInitialPayments.mutateAsync({
        leaseId,
        depositAmount,
        rentAmount,
      })

      toast({
        title: "Paiements enregistrés",
        description: "Les paiements initiaux ont été enregistrés avec succès"
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error handling initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label>Caution</Label>
          <Input 
            value={`${depositAmount.toLocaleString()} FCFA`} 
            disabled 
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Frais d'agence</Label>
          <Input 
            value={`${(rentAmount * 0.5).toLocaleString()} FCFA`} 
            disabled 
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Mode de paiement</Label>
          <Select 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Sélectionner le mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Espèces</SelectItem>
              <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date du premier loyer</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1.5 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {date && (
        <div className="rounded-lg border p-4 mt-4">
          <PaymentCountdown targetDate={date} />
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit">
          Enregistrer les paiements
        </Button>
      </div>
    </form>
  )
}