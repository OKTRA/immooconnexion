import { TableCell, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { AgencyActions } from "./AgencyActions"
import { AgencyPlanDialog } from "./AgencyPlanDialog"
import { AgencyBlockDialog } from "./dialogs/AgencyBlockDialog"
import { AgencyDeleteDialog } from "./dialogs/AgencyDeleteDialog"
import { AgencyPlanConfirmDialog } from "./dialogs/AgencyPlanConfirmDialog"

interface AgencyTableRowProps {
  agency: Agency;
  onEdit: (agency: Agency) => void;
  refetch: () => void;
}

export function AgencyTableRow({ agency, onEdit, refetch }: AgencyTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showOverviewDialog, setShowOverviewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showPlanConfirmDialog, setShowPlanConfirmDialog] = useState(false)
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null)
  const [editedAgency, setEditedAgency] = useState(agency)

  const handlePlanChange = async (planId: string) => {
    setPendingPlanId(planId)
    setShowPlanConfirmDialog(true)
  }

  return (
    <>
      <TableRow>
        <TableCell>{agency.name}</TableCell>
        <TableCell>{agency.address || "-"}</TableCell>
        <TableCell>{agency.phone || "-"}</TableCell>
        <TableCell>{agency.email || "-"}</TableCell>
        <TableCell>
          <AgencyActions 
            onEditClick={() => setShowEditDialog(true)}
            onOverviewClick={() => setShowOverviewDialog(true)}
            onDeleteClick={() => setShowDeleteDialog(true)}
            onPlanClick={() => setShowPlanDialog(true)}
            onBlockClick={() => setShowBlockDialog(true)}
            isBlocked={agency.status === 'blocked'}
          />
        </TableCell>
      </TableRow>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <AgencyForm 
            agency={editedAgency}
            setAgency={setEditedAgency}
            onSubmit={(editedAgency) => {
              onEdit(editedAgency)
              setShowEditDialog(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showOverviewDialog} onOpenChange={setShowOverviewDialog}>
        <DialogContent className="max-w-4xl">
          <AgencyOverview agency={agency} onRefetch={refetch} />
        </DialogContent>
      </Dialog>

      <AgencyPlanDialog
        open={showPlanDialog}
        onOpenChange={setShowPlanDialog}
        agency={agency}
        onPlanChange={handlePlanChange}
      />

      <AgencyDeleteDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        agencyId={agency.id}
        onSuccess={refetch}
      />

      <AgencyBlockDialog 
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={refetch}
        isBlocked={agency.status === 'blocked'}
      />

      <AgencyPlanConfirmDialog
        open={showPlanConfirmDialog}
        onOpenChange={setShowPlanConfirmDialog}
        agencyId={agency.id}
        pendingPlanId={pendingPlanId}
        onSuccess={() => {
          refetch()
          setShowPlanDialog(false)
          setPendingPlanId(null)
        }}
      />
    </>
  )
}