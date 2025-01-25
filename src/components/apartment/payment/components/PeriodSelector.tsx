import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PeriodOption } from "../types";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface PeriodSelectorProps {
  periodOptions: PeriodOption[];
  selectedPeriods: number;
  onPeriodsChange: (value: number) => void;
  paymentDate: Date;
  onPaymentDateChange: (date: Date) => void;
}

export function PeriodSelector({
  periodOptions,
  selectedPeriods,
  onPeriodsChange,
  paymentDate,
  onPaymentDateChange,
}: PeriodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre de périodes</Label>
          <Select 
            value={selectedPeriods.toString()} 
            onValueChange={(value) => onPeriodsChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le nombre de périodes" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  format(paymentDate, "P", { locale: fr })
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
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}