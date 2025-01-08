import { Button } from "@/components/ui/button"
import { 
  Pencil, 
  Trash2, 
  Receipt, 
  CreditCard, 
  ClipboardList, 
  FileCheck 
} from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

interface TenantActionButtonsProps {
  tenant: any;
  currentLease?: any;
  onEdit: () => void;
  onDelete: () => void;
  onInspection: () => void;
}

export function TenantActionButtons({ 
  tenant, 
  currentLease, 
  onEdit, 
  onDelete,
  onInspection 
}: TenantActionButtonsProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete()
    toast({
      title: "Succès",
      description: "Le locataire a été supprimé avec succès",
    })
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden md:inline">Modifier</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/agence/locataires/${tenant.id}/recu`)}
          className="flex items-center gap-2"
        >
          <Receipt className="h-4 w-4" />
          <span className="hidden md:inline">Reçu</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/agence/locataires/${tenant.id}/paiements`)}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          <span className="hidden md:inline">Paiements</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/agence/locataires/${tenant.id}/contrats`)}
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          <span className="hidden md:inline">Contrats</span>
        </Button>

        {currentLease && (
          <Button
            variant="outline"
            size="sm"
            onClick={onInspection}
            className="flex items-center gap-2"
          >
            <FileCheck className="h-4 w-4" />
            <span className="hidden md:inline">Fin de contrat</span>
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden md:inline">Supprimer</span>
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le locataire
              et toutes ses informations associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}