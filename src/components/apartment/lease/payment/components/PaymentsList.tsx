import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentListProps } from "../types"
import { CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react"
import { usePaymentDeletion } from "../hooks/usePaymentDeletion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function PaymentsList({ title, payments, className }: PaymentListProps) {
  const { deletePayment } = usePaymentDeletion();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paid_current':
        return 'default'
      case 'paid_advance':
        return 'secondary'
      case 'pending':
        return 'warning'
      case 'late':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paid_current':
      case 'paid_advance':
        return <CheckCircle2 className="w-4 h-4 mr-1" />
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />
      case 'late':
        return <AlertCircle className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid_advance':
        return 'Payé en avance'
      case 'paid_current':
      case 'paid':
        return 'Payé'
      case 'pending':
        return 'En attente'
      case 'late':
        return 'En retard'
      default:
        return status
    }
  }

  const getPaymentTypeLabel = (type?: string) => {
    switch (type) {
      case 'deposit':
        return 'Caution'
      case 'agency_fees':
        return 'Frais d\'agence'
      case 'rent':
      default:
        return 'Loyer'
    }
  }

  const handleDelete = async (paymentId: string) => {
    await deletePayment.mutateAsync(paymentId);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments?.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
              <div>
                <p className="font-medium">
                  {getPaymentTypeLabel(payment.type || payment.payment_type)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.payment_date ? format(new Date(payment.payment_date), 'PPP', { locale: fr }) : 'Date non définie'}
                  {payment.payment_period_start && payment.payment_period_end && (
                    <span className="ml-2">
                      (Période: {format(new Date(payment.payment_period_start), 'PP', { locale: fr })} - 
                      {format(new Date(payment.payment_period_end), 'PP', { locale: fr })})
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{payment.amount.toLocaleString()} FCFA</p>
                  <Badge 
                    variant={getStatusBadgeVariant(payment.displayStatus || payment.status)}
                    className="flex items-center"
                  >
                    {getStatusIcon(payment.displayStatus || payment.status)}
                    {getStatusLabel(payment.displayStatus || payment.status)}
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(payment.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {(!payments || payments.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              Aucun paiement trouvé
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}