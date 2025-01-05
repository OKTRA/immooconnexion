import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Users, Building2, UserPlus, Ban, Trash2 } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyOverview } from "./AgencyOverview"
import { AgencyForm } from "./AgencyForm"
import { AddProfileDialog } from "../profile/AddProfileDialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"

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

  const { data: plans = [] } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price", { ascending: true })
      
      if (error) throw error
      return data
    },
  })

  const handleStatusToggle = async () => {
    try {
      const newStatus = agency.status === 'active' ? 'blocked' : 'active'
      const { error } = await supabase
        .from('agencies')
        .update({ status: newStatus })
        .eq('id', agency.id)

      if (error) throw error

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
          <Select 
            value={agency.subscription_plan_id || ""} 
            onValueChange={handlePlanChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} ({plan.price} FCFA)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
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
              variant={agency.status === 'active' ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleStatusToggle}
            >
              <Ban className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
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