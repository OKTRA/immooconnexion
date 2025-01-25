import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentActions } from "./PaymentActions"

interface RegularPaymentsListProps {
  payments: any[]
  onPaymentAction: (paymentId: string, action: string) => void
}

export function RegularPaymentsList({ payments, onPaymentAction }: RegularPaymentsListProps) {
  const regularPayments = payments.filter(p => 
    p.type !== 'deposit' && p.type !== 'agency_fees'
  )

  if (regularPayments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun paiement régulier trouvé
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date d'échéance</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de paiement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regularPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {format(new Date(payment.due_date), "d MMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell>
              {payment.type === 'rent' ? 'Loyer' : payment.type}
            </TableCell>
            <TableCell>
              {payment.amount.toLocaleString()} FCFA
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  payment.status === 'paid'
                    ? 'success'
                    : payment.status === 'pending'
                    ? 'warning'
                    : 'destructive'
                }
              >
                {payment.status === 'paid'
                  ? 'Payé'
                  : payment.status === 'pending'
                  ? 'En attente'
                  : 'En retard'}
              </Badge>
            </TableCell>
            <TableCell>
              {payment.payment_date
                ? format(new Date(payment.payment_date), "d MMM yyyy", { locale: fr })
                : '-'}
            </TableCell>
            <TableCell className="text-right">
              <PaymentActions 
                payment={payment}
                onAction={onPaymentAction}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}