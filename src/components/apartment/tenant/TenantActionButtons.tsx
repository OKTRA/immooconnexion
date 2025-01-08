import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Receipt, CreditCard, FileText, CheckSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TenantActionButtonsProps {
  tenant: {
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }
  onEdit: () => void
  onDelete: () => void
  onShowReceipt: () => void
  onShowPayments: () => void
  onEndContract: () => void
}

export function TenantActionButtons({
  tenant,
  onEdit,
  onDelete,
  onShowReceipt,
  onShowPayments,
  onEndContract
}: TenantActionButtonsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onEdit}
      >
        <Edit2 className="h-4 w-4" />
        <span className="hidden md:inline">Modifier</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onShowReceipt}
      >
        <Receipt className="h-4 w-4" />
        <span className="hidden md:inline">Reçu</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onShowPayments}
      >
        <CreditCard className="h-4 w-4" />
        <span className="hidden md:inline">Paiements</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => navigate(`/locataires/${tenant.id}/contrats`)}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">Contrats</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onEndContract}
      >
        <CheckSquare className="h-4 w-4" />
        <span className="hidden md:inline">Fin de contrat</span>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="flex items-center gap-2"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden md:inline">Supprimer</span>
      </Button>
    </div>
  )
}