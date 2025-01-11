import { Button } from "@/components/ui/button"
import { FileText, Printer, ClipboardCheck, Edit, Trash2, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { TenantReceipt } from "./TenantReceipt"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"
import { TenantFormData, TenantReceiptData } from "@/types/tenant"

interface TenantActionButtonsProps {
  tenant: TenantFormData;
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
  const [showReceipt, setShowReceipt] = useState(false)
  const [showEndReceipt, setShowEndReceipt] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleEndContract = async () => {
    try {
      if (currentLease?.id) {
        const { error } = await supabase
          .from('apartment_leases')
          .update({ status: 'expired' })
          .eq('id', currentLease.id)

        if (error) throw error

        toast({
          title: "Contrat terminé",
          description: "Le contrat a été marqué comme terminé avec succès",
        })
        setShowEndReceipt(true)
      }
    } catch (error) {
      console.error('Error ending contract:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la terminaison du contrat",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  const tenantReceiptData: TenantReceiptData = {
    first_name: tenant.first_name,
    last_name: tenant.last_name,
    phone_number: tenant.phone_number,
    agency_fees: tenant.agency_fees || 0,
    profession: tenant.profession,
    property_id: tenant.property_id
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          <span className="hidden md:inline">Modifier</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReceipt(true)}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
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
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline">Contrats</span>
        </Button>

        {currentLease && currentLease.status === 'active' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onInspection}
              className="flex items-center gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden md:inline">Fin de contrat</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEndContract}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Reçu de fin</span>
            </Button>
          </>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden md:inline">Supprimer</span>
        </Button>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt 
            tenant={tenantReceiptData}
            isInitialReceipt={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEndReceipt} onOpenChange={setShowEndReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt 
            tenant={tenantReceiptData}
            isEndReceipt={true}
            lease={currentLease}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
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
