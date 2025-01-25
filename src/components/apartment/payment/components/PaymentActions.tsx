import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, FileText, CheckCircle, AlertCircle, Receipt } from "lucide-react"

interface PaymentActionsProps {
  payment: any
  onAction: (paymentId: string, action: string) => void
}

export function PaymentActions({ payment, onAction }: PaymentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {payment.status !== 'paid' && (
          <DropdownMenuItem onClick={() => onAction(payment.id, 'mark_as_paid')}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marquer comme payé
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onAction(payment.id, 'download_receipt')}>
          <Receipt className="h-4 w-4 mr-2" />
          Télécharger le reçu
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(payment.id, 'send_reminder')}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Envoyer un rappel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(payment.id, 'view_details')}>
          <FileText className="h-4 w-4 mr-2" />
          Voir les détails
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}