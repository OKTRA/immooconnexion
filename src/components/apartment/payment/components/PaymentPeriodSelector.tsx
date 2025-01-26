import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentFrequency } from "@/types/payment"

interface PaymentPeriodSelectorProps {
  paymentFrequency: PaymentFrequency
  rentAmount: number
  onPeriodsChange: (periods: number) => void
  totalAmount: number
}

export function PaymentPeriodSelector({
  paymentFrequency,
  rentAmount,
  onPeriodsChange,
  totalAmount
}: PaymentPeriodSelectorProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string>("1")

  // Définir le nombre maximum de périodes en fonction de la fréquence
  const getMaxPeriods = () => {
    switch (paymentFrequency) {
      case 'daily': return 31
      case 'weekly': return 4
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'biannual': return 2
      case 'yearly': return 5
      default: return 12
    }
  }

  // Générer les options de périodes
  const periodOptions = Array.from({ length: getMaxPeriods() }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${
      paymentFrequency === 'monthly' ? 'mois' : 
      paymentFrequency === 'daily' ? 'jours' :
      paymentFrequency === 'weekly' ? 'semaines' :
      paymentFrequency === 'quarterly' ? 'trimestres' :
      paymentFrequency === 'biannual' ? 'semestres' :
      'années'
    }`
  }))

  const handlePeriodChange = (value: string) => {
    setSelectedPeriods(value)
    onPeriodsChange(parseInt(value))
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label>Nombre de périodes</Label>
          <Select
            value={selectedPeriods}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le nombre de périodes" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label>Montant total</Label>
            <span className="text-xl font-bold">{totalAmount.toLocaleString()} FCFA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}