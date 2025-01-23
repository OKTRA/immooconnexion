import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck, FileText } from "lucide-react"
import { ActionButton } from "./actions/ActionButton"
import { DeleteAction } from "./actions/DeleteAction"
import { ApartmentLease } from "@/types/apartment"

interface TenantActionButtonsProps {
  tenant: {
    id: string
  }
  currentLease?: ApartmentLease
  onEdit: () => void
  onDelete: () => void
  onInspection: () => void
}

export function TenantActionButtons({ 
  tenant, 
  currentLease, 
  onEdit, 
  onDelete,
  onInspection 
}: TenantActionButtonsProps) {
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="flex gap-2">
        <ActionButton
          icon={Eye}
          onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}`)}
          title="Voir les détails"
        />

        <ActionButton
          icon={Edit}
          onClick={onEdit}
          title="Modifier"
        />

        <ActionButton
          icon={FileText}
          onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/lease`)}
          title="Créer un bail"
        />

        <ActionButton
          icon={CreditCard}
          onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/payments`)}
          title="Paiements"
        />

        <ActionButton
          icon={ClipboardList}
          onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/leases`)}
          title="Liste des baux"
        />

        {currentLease?.status === 'active' && (
          <>
            <ActionButton
              icon={FileCheck}
              onClick={onInspection}
              title="Inspection"
            />
            <ActionButton
              icon={Receipt}
              onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/receipt`)}
              title="Reçu"
            />
          </>
        )}

        <ActionButton
          icon={Trash2}
          onClick={handleDelete}
          title="Supprimer"
        />
      </div>

      <DeleteAction
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        hasActiveLease={currentLease?.status === 'active'}
      />
    </>
  )
}