import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentMethod } from "@/types/payment"

interface InitialPaymentFieldsProps {
  depositAmount: number
  rentAmount: number
  paymentMethod: PaymentMethod
  firstRentDate: Date
  onPaymentMethodChange: (method: PaymentMethod) => void
  onFirstRentDateChange: (date: Date) => void
}

export function InitialPaymentFields({
  depositAmount,
  rentAmount,
  paymentMethod,
  firstRentDate,
  onPaymentMethodChange,
  onFirstRentDateChange
}: InitialPaymentFieldsProps) {
  const agencyFees = rentAmount ? Math.round(rentAmount * 0.5) : 0
  const formattedDepositAmount = depositAmount ? depositAmount.toLocaleString() : "0"
  const formattedAgencyFees = agencyFees.toLocaleString()

  return (
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
            onChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
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
                onSelect={(date) => date && onFirstRentDateChange(date)}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  )
}