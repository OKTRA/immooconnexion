import { TableCell, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "@/integrations/supabase/types/agencies"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AgencyActions } from "./AgencyActions"
import { AgencyPlanSelect } from "./AgencyPlanSelect"

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

  const handleStatusToggle = async () => {
    try {
      const newStatus = agency.status === 'active' ? 'blocked' : 'active'
      
      // Update agency status
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', agency.id)

      if (updateError) throw updateError

      // Get all agency profiles to notify them
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .eq('agency_id', agency.id)

      if (profilesError) throw profilesError

      // Call edge function to send notification emails
      if (profiles && profiles.length > 0) {
        const emails = profiles.map(p => p.email).filter(Boolean)
        
        const { error: notifyError } = await supabase.functions.invoke('notify-agency-status', {
          body: {
            emails,
            agencyName: agency.name,
            status: newStatus
          }
        })

        if (notifyError) {
          console.error('Error sending notifications:', notifyError)
          toast({
            title: "Attention",
            description: "Le statut a été mis à jour mais l'envoi des notifications a échoué",
            variant: "destructive",
          })
        }
      }

      toast({
        title: "Statut mis à jour",
        description: `L'agence a été ${newStatus === 'blocked' ? 'bloquée' : 'activée'} avec succès`,
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Agence supprimée",
        description: "L'agence a été supprimée avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handlePlanChange = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ 
          subscription_plan_id: planId,
          updated_at: new Date().toISOString()
        })
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Plan mis à jour",
        description: "Le plan d'abonnement a été mis à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
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
          <Badge variant={agency.status === 'active' ? 'success' : 'destructive'}>
            {agency.status}
          </Badge>
        </TableCell>
        <TableCell>
          <AgencyPlanSelect 
            value={agency.subscription_plan_id || ""} 
            onValueChange={handlePlanChange}
          />
        </TableCell>
        <TableCell>
          <AgencyActions 
            agency={agency}
            onEdit={() => setShowEditDialog(true)}
            onAddProfile={() => setShowAddProfileDialog(true)}
            onViewOverview={() => setShowOverviewDialog(true)}
            onToggleStatus={handleStatusToggle}
            onDelete={() => setShowDeleteDialog(true)}
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

      <AddProfileDialog
        open={showAddProfileDialog}
        onOpenChange={setShowAddProfileDialog}
        agencyId={agency.id}
        onProfileCreated={refetch}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette agence ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à cette agence seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
