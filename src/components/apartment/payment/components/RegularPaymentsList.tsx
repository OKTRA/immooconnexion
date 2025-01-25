import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentActions } from "./PaymentActions"
import { TenantPaymentDetails } from "../types"

interface RegularPaymentsListProps {
  payments: TenantPaymentDetails[];
}

export function RegularPaymentsList({ payments }: RegularPaymentsListProps) {
  if (payments.length === 0) {
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
          <TableHead>Période</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de paiement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {payment.due_date && format(new Date(payment.due_date), "d MMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell>
              {payment.period_start && payment.period_end ? (
                <>
                  {format(new Date(payment.period_start), "d MMM", { locale: fr })} - {" "}
                  {format(new Date(payment.period_end), "d MMM yyyy", { locale: fr })}
                </>
              ) : (
                payment.type === 'rent' ? 'Loyer' : payment.type
              )}
            </TableCell>
            <TableCell>
              {payment.amount?.toLocaleString()} FCFA
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
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}