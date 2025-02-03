import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Period {
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'current' | 'late' | 'future';
}

interface PaymentPeriodsDisplayProps {
  periods: Period[];
  selectedPeriods: Period[];
  onPeriodSelect: (period: Period) => void;
  className?: string;
}

export function PaymentPeriodsDisplay({
  periods,
  selectedPeriods,
  onPeriodSelect,
  className
}: PaymentPeriodsDisplayProps) {
  const getStatusColor = (status: Period['status']) => {
    switch (status) {
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      case 'future':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: Period['status']) => {
    switch (status) {
      case 'current':
        return 'Période courante';
      case 'late':
        return 'En retard';
      case 'future':
        return 'Période future';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {periods.map((period, index) => (
        <Card
          key={index}
          className={cn(
            "p-4 cursor-pointer transition-colors",
            selectedPeriods.includes(period) && "ring-2 ring-primary",
            "hover:bg-accent/5"
          )}
          onClick={() => onPeriodSelect(period)}
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
            <Badge className={getStatusColor(period.status)}>
              {getStatusLabel(period.status)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}