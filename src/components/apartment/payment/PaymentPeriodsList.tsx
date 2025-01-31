import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentPeriod } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentPeriodsListProps {
  periods: PaymentPeriod[];
  onPeriodSelect?: (period: PaymentPeriod) => void;
  selectedPeriods?: PaymentPeriod[];
}

export function PaymentPeriodsList({
  periods,
  onPeriodSelect,
  selectedPeriods = []
}: PaymentPeriodsListProps) {
  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="p-4 space-y-2">
        {periods.map((period, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer transition-colors ${
              selectedPeriods.includes(period)
                ? "bg-primary/10"
                : "hover:bg-muted"
            } ${period.isPaid ? "opacity-50" : ""}`}
            onClick={() => !period.isPaid && onPeriodSelect?.(period)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{period.label}</p>
                <p className="text-sm text-muted-foreground">
                  {period.amount.toLocaleString()} FCFA
                </p>
              </div>
              <Badge variant={period.isPaid ? "secondary" : "outline"}>
                {period.isPaid ? "Payé" : "En attente"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}