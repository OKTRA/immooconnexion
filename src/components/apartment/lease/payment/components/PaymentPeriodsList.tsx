import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentPeriod } from "../types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentPeriodsListProps {
  selectedPeriods: PaymentPeriod[];
  onPeriodSelect: (period: PaymentPeriod) => void;
  isLoading?: boolean;
}

export function PaymentPeriodsList({
  selectedPeriods,
  onPeriodSelect,
  isLoading
}: PaymentPeriodsListProps) {
  if (isLoading) {
    return <div>Chargement des périodes...</div>;
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="p-4 space-y-2">
        {selectedPeriods.map((period) => (
          <Card
            key={period.id}
            className={`p-4 cursor-pointer transition-colors ${
              period.isPaid ? "opacity-50" : "hover:bg-muted"
            }`}
            onClick={() => !period.isPaid && onPeriodSelect(period)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {format(period.startDate, "d MMMM yyyy", { locale: fr })} -{" "}
                  {format(period.endDate, "d MMMM yyyy", { locale: fr })}
                </p>
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