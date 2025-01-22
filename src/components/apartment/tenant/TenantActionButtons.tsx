import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"

interface TenantActionButtonsProps {
  tenant: any
  currentLease?: any
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
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      // Mettre à jour le statut de l'unité à "available"
      if (tenant.unit_id) {
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "available" })
          .eq("id", tenant.unit_id)

        if (unitError) throw unitError
      }

      // Supprimer le locataire
      const { error: tenantError } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", tenant.id)

      if (tenantError) throw tenantError

      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })
      queryClient.invalidateQueries({ queryKey: ["apartment-units"] })

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })

      onDelete()
    } catch (error: any) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/payments`)}
      >
        <CreditCard className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/leases`)}
      >
        <ClipboardList className="h-4 w-4" />
      </Button>

      {currentLease?.status === 'active' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onInspection}
        >
          <FileCheck className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible et libérera l'unité associée.
              {currentLease?.status === 'active' && (
                <p className="mt-2 text-red-500">
                  Attention : Ce locataire a un bail actif. La suppression mettra fin à tous les contrats associés.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}