import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck, FileSignature } from "lucide-react"
import { ActionButton } from "./actions/ActionButton"
import { DeleteAction } from "./actions/DeleteAction"
import { LeaseDialog } from "./LeaseDialog"
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
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)

  const handleDelete = () => {
    setShowDeleteDialog(true)
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
          icon={FileSignature}
          onClick={() => setShowLeaseDialog(true)}
          title="Créer un bail"
          className="text-green-500 hover:text-green-600"
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
        onConfirm={() => {
          onDelete()
          setShowDeleteDialog(false)
        }}
        hasActiveLease={currentLease?.status === 'active'}
      />

      <LeaseDialog
        open={showLeaseDialog}
        onOpenChange={setShowLeaseDialog}
        tenantId={tenant.id}
      />
    </>
  )
}