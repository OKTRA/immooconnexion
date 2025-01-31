import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { PaymentPeriodsList } from "./PaymentPeriodsList";
import { useLeasePeriods, PaymentPeriod } from "@/hooks/use-lease-periods";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentFormProps {
  lease: any;
  onSuccess?: () => void;
}

export function PaymentForm({ lease, onSuccess }: PaymentFormProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<PaymentPeriod[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { periods } = useLeasePeriods(lease, lease.payments || []);

  const handlePeriodSelect = (period: PaymentPeriod) => {
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
      // Créer un paiement pour chaque période sélectionnée
      for (const period of selectedPeriods) {
        const { error } = await supabase.rpc('create_lease_payment', {
          p_lease_id: lease.id,
          p_amount: period.amount,
          p_payment_type: 'rent',
          p_payment_method: paymentMethod,
          p_payment_date: paymentDate,
          p_period_start: period.startDate.toISOString(),
          p_period_end: period.endDate.toISOString()
        });

        if (error) throw error;
      }

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentPeriodsList
        periods={periods}
        selectedPeriods={selectedPeriods}
        onPeriodSelect={handlePeriodSelect}
      />

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <div>
            <Label>Date de paiement</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant total</span>
              <span className="text-lg font-bold">
                {selectedPeriods.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA
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
        {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
      </Button>
    </form>
  );
}