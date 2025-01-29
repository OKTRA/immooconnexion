import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PaymentMethodField } from "./form/PaymentMethodField";
import { HistoricalPaymentFormProps } from "../types";
import { PaymentMethod } from "@/types/payment";
import { Loader2 } from "lucide-react";

export function HistoricalPaymentForm({
  lease,
  onSuccess,
  isSubmitting,
  setIsSubmitting
}: HistoricalPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(lease.rent_amount);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement historical payment submission
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting historical payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paiement historique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Montant</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <PaymentMethodField
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <div className="space-y-2">
            <Label>Date de paiement</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (optionnel)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes sur le paiement"
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
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