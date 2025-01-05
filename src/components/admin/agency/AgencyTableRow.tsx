import { TableCell, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { AgencyActions } from "./AgencyActions"
import { AgencyPlanDialog } from "./AgencyPlanDialog"
import { AgencyDeleteDialog } from "./dialogs/AgencyDeleteDialog"
import { AgencyStatusDialog } from "./dialogs/AgencyStatusDialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AgencyTableRowProps {
  agency: Agency
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTableRow({ agency, onEdit, refetch }: AgencyTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showOverviewDialog, setShowOverviewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showPlanConfirmDialog, setShowPlanConfirmDialog] = useState(false)
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null)
  const [editedAgency, setEditedAgency] = useState(agency)
  const { toast } = useToast()

  const handlePlanChange = async (planId: string) => {
    setPendingPlanId(planId)
    setShowPlanConfirmDialog(true)
  }

  const confirmPlanChange = async () => {
    if (!pendingPlanId) return

    try {
      // First check if downgrade is possible
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', pendingPlanId)
        .single()

      if (!plan) throw new Error("Plan not found")

      const canDowngrade = 
        (plan.max_properties === -1 || agency.current_properties_count <= plan.max_properties) &&
        (plan.max_tenants === -1 || agency.current_tenants_count <= plan.max_tenants) &&
        (plan.max_users === -1 || agency.current_profiles_count <= plan.max_users)

      if (!canDowngrade) {
        toast({
          title: "Changement impossible",
          description: "L'agence dépasse les limites du plan sélectionné",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('agencies')
        .update({ subscription_plan_id: pendingPlanId })
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le plan d'abonnement a été mis à jour",
      })
      refetch()
    } catch (error: any) {
      console.error('Error updating subscription plan:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du plan",
        variant: "destructive",
      })
    } finally {
      setShowPlanConfirmDialog(false)
      setShowPlanDialog(false)
      setPendingPlanId(null)
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>{agency.name}</TableCell>
        <TableCell>{agency.address || "-"}</TableCell>
        <TableCell>{agency.phone || "-"}</TableCell>
        <TableCell>{agency.email || "-"}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              agency.status === 'blocked' 
                ? 'bg-red-100 text-red-800' 
                : agency.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {agency.status === 'blocked' 
                ? 'Bloquée' 
                : agency.status === 'pending' 
                ? 'En attente' 
                : 'Active'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <AgencyActions 
            onEditClick={() => setShowEditDialog(true)}
            onOverviewClick={() => setShowOverviewDialog(true)}
            onDeleteClick={() => setShowDeleteDialog(true)}
            onPlanClick={() => setShowPlanDialog(true)}
            onStatusClick={() => setShowStatusDialog(true)}
            status={agency.status}
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
        agencyId={agency.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={refetch}
      />

      <AgencyStatusDialog
        agencyId={agency.id}
        currentStatus={agency.status}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onSuccess={refetch}
      />

      <AlertDialog open={showPlanConfirmDialog} onOpenChange={setShowPlanConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le changement de plan</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir modifier le plan d'abonnement de cette agence ? 
              Cette action peut affecter les fonctionnalités disponibles pour l'agence.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowPlanConfirmDialog(false)
              setPendingPlanId(null)
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPlanChange}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}