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
          <RadioGroupItem value="cinetpay" id="cinetpay" />
          <Label htmlFor="cinetpay" className="flex flex-col">
            <span className="font-semibold">CinetPay</span>
            <span className="text-sm text-gray-500">
              Carte bancaire, Mobile Money (International)
            </span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-4 rounded-lg border p-4">
          <RadioGroupItem value="paydunya" id="paydunya" />
          <Label htmlFor="paydunya" className="flex flex-col">
            <span className="font-semibold">PayDunya</span>
            <span className="text-sm text-gray-500">
              Wave, Orange Money, Free Money (International)
            </span>
          </Label>
        </div>

        <div className="flex items-center space-x-4 rounded-lg border p-4">
          <RadioGroupItem value="orange-money" id="orange-money" />
          <Label htmlFor="orange-money" className="flex flex-col">
            <span className="font-semibold">Orange Money</span>
            <span className="text-sm text-gray-500">
              Paiement mobile local
            </span>
          </Label>
        </div>
      </RadioGroup>
    </Card>
  )
}