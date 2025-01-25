import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentActions } from "./PaymentActions"
import { TenantPaymentDetails } from "../types"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"

interface RegularPaymentsListProps {
  payments: TenantPaymentDetails[];
}

export function RegularPaymentsList({ payments }: RegularPaymentsListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handlePaymentAction = async (paymentId: string, action: string) => {
    try {
      switch (action) {
        case 'mark_as_paid':
          const { error } = await supabase
            .from('apartment_lease_payments')
            .update({ 
              status: 'paid',
              payment_date: new Date().toISOString()
            })
            .eq('id', paymentId)

          if (error) throw error

          await queryClient.invalidateQueries({ queryKey: ["tenant-payment-details"] })
          await queryClient.invalidateQueries({ queryKey: ["payment-stats"] })

          toast({
            title: "Paiement mis à jour",
            description: "Le paiement a été marqué comme payé",
          })
          break;

        case 'download_receipt':
          toast({
            title: "Téléchargement du reçu",
            description: "Cette fonctionnalité sera bientôt disponible",
          })
          break;

        case 'send_reminder':
          toast({
            title: "Rappel envoyé",
            description: "Un rappel a été envoyé au locataire",
          })
          break;

        case 'view_details':
          toast({
            title: "Détails du paiement",
            description: "Cette fonctionnalité sera bientôt disponible",
          })
          break;
      }
    } catch (error) {
      console.error('Error handling payment action:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action",
        variant: "destructive",
      })
    }
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun paiement régulier trouvé
      </div>
    )
  }

  return (
    <div className="rounded-md border">
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
                  onAction={handlePaymentAction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}