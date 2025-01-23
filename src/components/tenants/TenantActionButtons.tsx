import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck, FileText } from "lucide-react"
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
    property_id: tenant.property_id,
    lease: currentLease ? {
      rent_amount: currentLease.rent_amount,
      deposit_amount: currentLease.deposit_amount || 0
    } : undefined
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
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
          onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/lease`)}
          title="Créer un bail"
        >
          <FileText className="h-4 w-4" />
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
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onInspection}
            >
              <FileCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEndContract}
            >
              <Receipt className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
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
            inspection={currentLease?.inspection}
          />
        </DialogContent>
      </Dialog>

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