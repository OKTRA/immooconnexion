import { TableCell, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AgencyActions } from "./AgencyActions"
import { AgencyPlanDialog } from "./AgencyPlanDialog"

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
  const [editedAgency, setEditedAgency] = useState(agency)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      // First check if there are any dependencies
      const { data: contracts } = await supabase
        .from('contracts')
        .select('id')
        .eq('agency_id', agency.id)
        .limit(1)

      if (contracts && contracts.length > 0) {
        toast({
          title: "Suppression impossible",
          description: "Cette agence a des contrats actifs. Veuillez d'abord les supprimer.",
          variant: "destructive",
        })
        setShowDeleteDialog(false)
        return
      }

      const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'agence a été supprimée avec succès",
      })
      
      refetch()
    } catch (error: any) {
      console.error('Error deleting agency:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de l'agence",
        variant: "destructive",
      })
    }
    setShowDeleteDialog(false)
  }

  const handlePlanChange = async (planId: string) => {
    try {
      // First check if downgrade is possible
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
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
        .update({ subscription_plan_id: planId })
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
          <AgencyActions 
            onEditClick={() => setShowEditDialog(true)}
            onOverviewClick={() => setShowOverviewDialog(true)}
            onDeleteClick={() => setShowDeleteDialog(true)}
            onPlanClick={() => setShowPlanDialog(true)}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'agence et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}