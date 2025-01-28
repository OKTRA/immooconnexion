import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentTypeFieldProps {
  value: 'current' | 'advance';
  onChange: (value: 'current' | 'advance') => void;
}

export function PaymentTypeField({ value, onChange }: PaymentTypeFieldProps) {
  return (
    <div className="space-y-2">
      <Label>Type de paiement</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange as (value: string) => void}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="current" id="current" />
          <Label htmlFor="current">Paiement courant</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advance" id="advance" />
          <Label htmlFor="advance">Paiement d'avance</Label>
        </div>
      </RadioGroup>
    </div>
  );
}