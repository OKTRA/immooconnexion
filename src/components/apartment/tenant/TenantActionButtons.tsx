import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Eye, Trash2, Receipt, ClipboardList, FileCheck, FileText } from "lucide-react"
import { ActionButton } from "./actions/ActionButton"
import { DeleteAction } from "./actions/DeleteAction"
import { LeaseDialog } from "./LeaseDialog"
import { ApartmentLease } from "@/types/apartment"
import { PaymentActionButton } from "../payment/PaymentActionButton"

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
          onClick={() => setShowLeaseDialog(true)}
          title="Créer un bail"
        />

        <PaymentActionButton 
          tenantId={tenant.id}
          leaseId={currentLease?.id}
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
          onClick={() => setShowDeleteDialog(true)}
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