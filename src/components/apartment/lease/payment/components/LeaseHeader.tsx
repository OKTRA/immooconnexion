
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LeaseData } from "../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PlusCircle, RefreshCw } from "lucide-react"

interface LeaseHeaderProps {
  lease: LeaseData
  onInitialPayment: () => void
  onRegularPayment: () => void
  canMakeRegularPayments: boolean
  needsInitialPayments: boolean
}

export function LeaseHeader({ 
  lease, 
  onInitialPayment,
  onRegularPayment,
  canMakeRegularPayments,
  needsInitialPayments
}: LeaseHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Paiements du Bail
            </h1>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Locataire:</span> {lease.tenant.first_name} {lease.tenant.last_name}
              </p>
              <p>
                <span className="font-medium">Appartement:</span> {lease.unit?.apartment?.name} - Unité {lease.unit?.unit_number}
              </p>
              <p>
                <span className="font-medium">Loyer:</span> {lease.rent_amount.toLocaleString()} FCFA
              </p>
              <p>
                <span className="font-medium">Date de début:</span> {format(new Date(lease.start_date), "d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            {needsInitialPayments && (
              <Button 
                onClick={onInitialPayment}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Paiements Initiaux
              </Button>
            )}
            
            {canMakeRegularPayments && (
              <Button 
                onClick={onRegularPayment}
                className="w-full sm:w-auto"
                variant={needsInitialPayments ? "outline" : "default"}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Gestion des Paiements
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
