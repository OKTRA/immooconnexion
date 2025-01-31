import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentPeriod } from "@/hooks/use-lease-periods";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Périodes de paiement</h3>
      <div className="grid gap-2">
        {selectedPeriods.map((period) => (
          <Card
            key={period.id}
            className={cn(
              "p-4 cursor-pointer transition-colors",
              "hover:bg-accent",
              period.status === "paid" && "bg-green-50",
              period.status === "late" && "bg-red-50"
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
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    period.status === "paid" && "bg-green-100 text-green-800",
                    period.status === "pending" && "bg-yellow-100 text-yellow-800",
                    period.status === "late" && "bg-red-100 text-red-800"
                  )}
                >
                  {period.status === "paid" && "Payé"}
                  {period.status === "pending" && "En attente"}
                  {period.status === "late" && "En retard"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}