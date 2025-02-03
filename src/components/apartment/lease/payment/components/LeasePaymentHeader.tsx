import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Receipt } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { LeaseData } from "../types"

interface LeasePaymentHeaderProps {
  lease: LeaseData
  onInitialPayment: () => void
  onRegularPayment?: () => void
}

export function LeasePaymentHeader({ 
  lease,
  onInitialPayment,
  onRegularPayment
}: LeasePaymentHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {lease.tenant?.first_name} {lease.tenant?.last_name}
            </h2>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                Unité: {lease.unit?.apartment?.name} - {lease.unit?.unit_number}
              </p>
              <p>
                Début du bail: {format(new Date(lease.start_date), "PP", { locale: fr })}
              </p>
              <p>
                Loyer mensuel: {lease.rent_amount?.toLocaleString()} FCFA
              </p>
              <p>
                Caution: {lease.deposit_amount?.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          <div className="space-x-2">
            {!lease.initial_payments_completed && (
              <Button 
                onClick={onInitialPayment}
                variant="default"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Paiements Initiaux
              </Button>
            )}
            {lease.initial_payments_completed && onRegularPayment && (
              <Button 
                onClick={onRegularPayment}
                variant="default"
              >
                <Receipt className="mr-2 h-4 w-4" />
                Gestion des Paiements
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}