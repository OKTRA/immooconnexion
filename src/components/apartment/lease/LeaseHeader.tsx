import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreditCard, PlusCircle } from "lucide-react"
import { LeaseData } from "../types"

interface LeaseHeaderProps {
  lease: LeaseData
  onInitialPayment: () => void
  onRegularPayment: () => void
}

export function LeaseHeader({ lease, onInitialPayment, onRegularPayment }: LeaseHeaderProps) {
  const tenant = lease.tenant
  const unit = lease.unit

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {tenant?.first_name?.[0]}{tenant?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {tenant?.first_name} {tenant?.last_name}
              </h2>
              <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>{unit?.apartment?.name} - Unité {unit?.unit_number}</span>
                </div>
                {tenant?.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{tenant.phone_number}</span>
                  </div>
                )}
                {tenant?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{tenant.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {!lease.initial_payments_completed && (
              <Button 
                onClick={onInitialPayment}
                className="bg-green-500 hover:bg-green-600"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Paiements Initiaux
              </Button>
            )}
            
            <Button 
              onClick={onRegularPayment}
              disabled={!lease.initial_payments_completed}
              variant="default"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Paiement de Loyer
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}