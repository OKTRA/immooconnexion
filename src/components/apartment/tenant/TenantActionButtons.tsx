import { Button } from "@/components/ui/button"
import { LeaseDialog } from "./LeaseDialog"
import { SplitLeaseDialog } from "../lease/SplitLeaseDialog"
import { useState } from "react"
import { ActionButton } from "./actions/ActionButton"
import { Edit, FileText, Split, Trash2 } from "lucide-react"
import { DeleteAction } from "./actions/DeleteAction"

interface TenantActionButtonsProps {
  tenantId: string
  onEdit: () => void
  onDelete: () => void
}

export function TenantActionButtons({ tenantId, onEdit, onDelete }: TenantActionButtonsProps) {
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [showSplitLeaseDialog, setShowSplitLeaseDialog] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={FileText}
        onClick={() => setShowLeaseDialog(true)}
        title="Créer un bail"
      />
      
      <ActionButton
        icon={Split}
        onClick={() => setShowSplitLeaseDialog(true)}
        title="Créer un bail partagé"
        className="text-blue-600 hover:text-blue-700"
      />

      <ActionButton
        icon={Edit}
        onClick={onEdit}
        title="Modifier"
      />

      <DeleteAction onDelete={onDelete} />

      <LeaseDialog
        open={showLeaseDialog}
        onOpenChange={setShowLeaseDialog}
        tenantId={tenantId}
      />

      <SplitLeaseDialog
        open={showSplitLeaseDialog}
        onOpenChange={setShowSplitLeaseDialog}
        tenantId={tenantId}
      />
    </div>
  )
}