import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PaymentPeriod } from "../types";

interface PeriodsListProps {
  periods: PaymentPeriod[];
}

export function PeriodsList({ periods }: PeriodsListProps) {
  return (
    <div className="space-y-4">
      {periods.map((period, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
        >
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Période {format(period.startDate, 'PP', { locale: fr })} - {format(period.endDate, 'PP', { locale: fr })}
              </p>
              <Badge variant={period.status === "paid" ? "default" : "secondary"}>
                {period.status === "paid" ? "Payé" : "En attente"}
              </Badge>
            </div>
          </div>
          
          <div className="text-right ml-4">
            <p className="font-semibold">
              {period.amount.toLocaleString()} FCFA
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}