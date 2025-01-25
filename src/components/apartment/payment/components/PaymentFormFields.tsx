import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod } from "../types";

interface PaymentFormFieldsProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function PaymentFormFields({
  paymentMethod,
  onPaymentMethodChange,
  notes,
  onNotesChange
}: PaymentFormFieldsProps) {
  return (
    <div className="space-y-6">
      <PaymentMethodSelect
        value={paymentMethod}
        onChange={onPaymentMethodChange}
      />

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Ajouter des notes sur le paiement..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}