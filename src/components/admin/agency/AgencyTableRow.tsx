import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Users, Building2, UserPlus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AgencySubscriptionPlan } from "./AgencySubscriptionPlan"

interface AgencyTableRowProps {
  agency: Agency
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTableRow({ agency, onEdit, refetch }: AgencyTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showOverviewDialog, setShowOverviewDialog] = useState(false)
  const [showAddProfileDialog, setShowAddProfileDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editedAgency, setEditedAgency] = useState(agency)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOverviewDialog(true)}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Vue d'ensemble
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddProfileDialog(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un profil
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
          <AgencySubscriptionPlan 
            agency={editedAgency}
            onPlanChange={handlePlanChange}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showOverviewDialog} onOpenChange={setShowOverviewDialog}>
        <DialogContent className="max-w-4xl">
          <AgencyOverview agency={agency} onRefetch={refetch} />
        </DialogContent>
      </Dialog>

      <AddProfileDialog
        open={showAddProfileDialog}
        onOpenChange={setShowAddProfileDialog}
        agencyId={agency.id}
        onProfileCreated={refetch}
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