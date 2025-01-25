import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Pencil, Send, Database, Trash2, Receipt } from "lucide-react"
import { PaymentActionButton } from "../../payment/PaymentActionButton"
import { useNavigate } from "react-router-dom"

interface LeaseTableRowProps {
  lease: any
  onEdit: (lease: any) => void
  onDelete: (id: string) => void
  onGeneratePaymentPeriods: (id: string) => void
  onGeneratePaymentPeriodsDirectly: (id: string) => void
  isGenerating: boolean
}

export function LeaseTableRow({
  lease,
  onEdit,
  onDelete,
  onGeneratePaymentPeriods,
  onGeneratePaymentPeriodsDirectly,
  isGenerating,
}: LeaseTableRowProps) {
  const navigate = useNavigate()

  return (
    <TableRow>
      <TableCell>
        {lease.tenant?.first_name} {lease.tenant?.last_name}
      </TableCell>
      <TableCell>{lease.unit?.apartment?.name}</TableCell>
      <TableCell>{lease.unit?.unit_number}</TableCell>
      <TableCell>
        {format(new Date(lease.start_date), "PP", { locale: fr })}
      </TableCell>
      <TableCell>
        {lease.end_date
          ? format(new Date(lease.end_date), "PP", { locale: fr })
          : "En cours"}
      </TableCell>
      <TableCell>
        {lease.rent_amount.toLocaleString()} FCFA
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            lease.status === "active"
              ? "bg-green-50 text-green-700"
              : lease.status === "expired"
              ? "bg-red-50 text-red-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {lease.status === "active"
            ? "Actif"
            : lease.status === "expired"
            ? "Expiré"
            : "En attente"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(lease)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(lease.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <PaymentActionButton
            tenantId={lease.tenant_id}
            leaseId={lease.id}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onGeneratePaymentPeriods(lease.id)}
            disabled={isGenerating}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onGeneratePaymentPeriodsDirectly(lease.id)}
            disabled={isGenerating}
          >
            <Database className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/agence/apartment-leases/${lease.id}/payments`)}
            title="Voir les paiements"
          >
            <Receipt className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}