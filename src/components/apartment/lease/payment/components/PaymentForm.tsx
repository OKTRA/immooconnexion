import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethodField } from "./form/PaymentMethodField";
import { PaymentPeriodsDisplay } from "./PaymentPeriodsDisplay";
import { usePaymentPeriods } from "../hooks/usePaymentPeriods";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  leaseId: string;
  onSuccess?: () => void;
}

export function PaymentForm({ leaseId, onSuccess }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<'current' | 'historical' | 'late'>('current');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedPeriods, setSelectedPeriods] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: periodsData, isLoading } = usePaymentPeriods(leaseId);

  const handlePeriodSelect = (period: any) => {
    if (selectedPeriods.includes(period)) {
      setSelectedPeriods(selectedPeriods.filter(p => p !== period));
    } else {
      setSelectedPeriods([...selectedPeriods, period]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Logique de soumission à implémenter
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label>Type de paiement</Label>
            <RadioGroup
              value={paymentType}
              onValueChange={(value: 'current' | 'historical' | 'late') => setPaymentType(value)}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              <div>
                <RadioGroupItem value="current" id="current" className="peer sr-only" />
                <Label
                  htmlFor="current"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Paiement courant
                </Label>
              </div>
              <div>
                <RadioGroupItem value="historical" id="historical" className="peer sr-only" />
                <Label
                  htmlFor="historical"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Paiement historique
                </Label>
              </div>
              <div>
                <RadioGroupItem value="late" id="late" className="peer sr-only" />
                <Label
                  htmlFor="late"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Paiement en retard
                </Label>
              </div>
            </RadioGroup>
          </div>

          {periodsData?.periods && (
            <PaymentPeriodsDisplay
              periods={periodsData.periods}
              selectedPeriods={selectedPeriods}
              onPeriodSelect={handlePeriodSelect}
            />
          )}

          <PaymentMethodField
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant total</span>
              <span className="text-lg font-bold">
                {(selectedPeriods.reduce((sum, p) => sum + p.amount, 0)).toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || selectedPeriods.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          "Enregistrer le paiement"
        )}
      </Button>
    </form>
  );
}