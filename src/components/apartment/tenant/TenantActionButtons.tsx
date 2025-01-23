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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="flex gap-2">
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
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
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
    </>
  )
}