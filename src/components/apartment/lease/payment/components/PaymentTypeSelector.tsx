import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export type PaymentType = 'current' | 'historical' | 'late';

interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  hasLatePayments?: boolean;
  latePaymentsCount?: number;
  totalLateAmount?: number;
}

export function PaymentTypeSelector({ 
  value, 
  onChange,
  hasLatePayments,
  latePaymentsCount = 0,
  totalLateAmount = 0
}: PaymentTypeSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {hasLatePayments && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Il y a {latePaymentsCount} période(s) de paiement en retard pour un montant total de {totalLateAmount.toLocaleString()} FCFA.
              Ces retards doivent être réglés avant tout nouveau paiement.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Type de paiement</Label>
          <RadioGroup
            value={value}
            onValueChange={onChange as (value: string) => void}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="current" 
                id="current" 
                disabled={hasLatePayments}
              />
              <Label 
                htmlFor="current" 
                className={hasLatePayments ? "text-muted-foreground" : ""}
              >
                Paiement courant/avance
              </Label>
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