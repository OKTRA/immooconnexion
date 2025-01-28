import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodFieldProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodField({ value, onChange }: PaymentMethodFieldProps) {
  return (
    <div className="space-y-2">
      <Label>Mode de paiement</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le mode de paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Espèces</SelectItem>
          <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
          <SelectItem value="mobile_money">Mobile Money</SelectItem>
          <SelectItem value="check">Chèque</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}