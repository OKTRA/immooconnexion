import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type PaymentType = 'current' | 'historical' | 'late';

interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
}

export function PaymentTypeSelector({ value, onChange }: PaymentTypeSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label>Type de paiement</Label>
          <RadioGroup
            value={value}
            onValueChange={onChange as (value: string) => void}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current">Paiement courant/avance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="historical" id="historical" />
              <Label htmlFor="historical">Paiement historique</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="late" id="late" />
              <Label htmlFor="late">Paiement en retard</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}