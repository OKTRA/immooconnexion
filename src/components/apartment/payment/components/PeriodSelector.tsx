import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PeriodOption } from "../types"

interface PeriodSelectorProps {
  periods: PeriodOption[]
  selectedPeriods: string[]
  onPeriodsChange: (periods: string[]) => void
  paymentDate: Date
  onPaymentDateChange: (date: Date) => void
}

export function PeriodSelector({
  periods,
  selectedPeriods,
  onPeriodsChange,
  paymentDate,
  onPaymentDateChange
}: PeriodSelectorProps) {
  const handlePeriodToggle = (periodId: string) => {
    if (selectedPeriods.includes(periodId)) {
      onPeriodsChange(selectedPeriods.filter(id => id !== periodId))
    } else {
      onPeriodsChange([...selectedPeriods, periodId])
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Périodes de paiement</Label>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <div className="p-4 space-y-2">
            {periods.map((period) => (
              <div key={period.id} className="flex items-center space-x-2">
                <Checkbox
                  id={period.id}
                  checked={selectedPeriods.includes(period.id)}
                  onCheckedChange={() => handlePeriodToggle(period.id)}
                />
                <label
                  htmlFor={period.id}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {format(period.startDate, "d MMMM yyyy", { locale: fr })} - {format(period.endDate, "d MMMM yyyy", { locale: fr })}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <Label>Date de paiement</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !paymentDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {paymentDate ? (
                format(paymentDate, "d MMMM yyyy", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={paymentDate}
              onSelect={(date) => date && onPaymentDateChange(date)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}