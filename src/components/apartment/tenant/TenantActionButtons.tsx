import { Button } from "@/components/ui/button"
import { FileText, Trash2, Edit, Plus } from "lucide-react"
import { DeleteAction } from "./actions/DeleteAction"
import { useState } from "react"
import { LeaseDialog } from "../lease/LeaseDialog"

interface TenantActionButtonsProps {
  tenantId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function TenantActionButtons({ tenantId, onEdit, onDelete }: TenantActionButtonsProps) {
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowLeaseDialog(true)}
        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <DeleteAction onConfirm={onDelete} />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.location.href = `/agence/apartment-tenant-leases/${tenantId}`}
      >
        <FileText className="h-4 w-4" />
      </Button>

      <LeaseDialog
        open={showLeaseDialog}
        onOpenChange={setShowLeaseDialog}
        tenantId={tenantId}
      />
    </div>
  )
}