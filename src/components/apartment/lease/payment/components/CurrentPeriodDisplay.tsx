import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PaymentPeriod } from "../types";

interface CurrentPeriodDisplayProps {
  period: PaymentPeriod;
  progress: number;
}

export function CurrentPeriodDisplay({ period, progress }: CurrentPeriodDisplayProps) {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-primary rounded-lg hover:bg-accent/5 transition-colors">
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-center">
          <p className="font-medium">Période en cours</p>
          <Badge variant={period.status === "paid" ? "default" : "secondary"}>
            {period.status === "paid" ? "Payé" : "En attente"}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Du {format(period.startDate, 'PP', { locale: fr })} au{' '}
          {format(period.endDate, 'PP', { locale: fr })}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>
      
      <div className="text-right ml-4">
        <p className="font-semibold">
          {period.amount.toLocaleString()} FCFA
        </p>
      </div>
    </div>
  );
}