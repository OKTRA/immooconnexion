import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <Card className="p-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={onMethodChange}
        className="grid gap-4"
      >
        <div className="flex items-center space-x-4 rounded-lg border p-4">
          <RadioGroupItem value="orange_money" id="orange_money" />
          <Label htmlFor="orange_money" className="flex flex-col">
            <span className="font-semibold">Orange Money</span>
            <span className="text-sm text-gray-500">
              Paiement mobile rapide et sécurisé
            </span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-4 rounded-lg border p-4">
          <RadioGroupItem value="cinetpay" id="cinetpay" />
          <Label htmlFor="cinetpay" className="flex flex-col">
            <span className="font-semibold">CinetPay</span>
            <span className="text-sm text-gray-500">
              Carte bancaire, Mobile Money (International)
            </span>
          </Label>
        </div>
      </RadioGroup>
    </Card>
  )
}