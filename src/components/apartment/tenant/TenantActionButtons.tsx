import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Receipt, CreditCard, ClipboardList, FileCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ApartmentContract } from "../types"

interface TenantActionButtonsProps {
  tenant: any;
  currentLease?: ApartmentContract;
  onEdit: () => void;
  onDelete: () => void;
  onInspection: () => void;
}

export function TenantActionButtons({ 
  tenant, 
  currentLease, 
  onEdit, 
  onDelete,
  onInspection 
}: TenantActionButtonsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        <span className="hidden md:inline">Modifier</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/recu`)}
        className="flex items-center gap-2"
      >
        <Receipt className="h-4 w-4" />
        <span className="hidden md:inline">Reçu</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/paiements`)}
        className="flex items-center gap-2"
      >
        <CreditCard className="h-4 w-4" />
        <span className="hidden md:inline">Paiements</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/contrats`)}
        className="flex items-center gap-2"
      >
        <ClipboardList className="h-4 w-4" />
        <span className="hidden md:inline">Contrats</span>
      </Button>

      {currentLease && (
        <Button
          variant="outline"
          size="sm"
          onClick={onInspection}
          className="flex items-center gap-2"
        >
          <FileCheck className="h-4 w-4" />
          <span className="hidden md:inline">Fin de contrat</span>
        </Button>
      )}

      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden md:inline">Supprimer</span>
      </Button>
    </div>
  )
}