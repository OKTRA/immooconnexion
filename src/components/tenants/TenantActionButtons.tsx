import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { TenantFormData } from "@/types/tenant"
import { LeaseDialog } from "@/components/apartment/tenant/LeaseDialog"
import { ReceiptDialogs } from "./actions/ReceiptDialogs"
import { DeleteConfirmDialog } from "./actions/DeleteConfirmDialog"

interface TenantActionButtonsProps {
  tenant: TenantFormData
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
  const { toast } = useToast()
  const [showReceipt, setShowReceipt] = useState(false)
  const [showEndReceipt, setShowEndReceipt] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)

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

  const tenantReceiptData = {
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
          onClick={() => setShowLeaseDialog(true)}
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
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ReceiptDialogs
        showReceipt={showReceipt}
        setShowReceipt={setShowReceipt}
        showEndReceipt={showEndReceipt}
        setShowEndReceipt={setShowEndReceipt}
        tenant={tenantReceiptData}
        currentLease={currentLease}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete()
          setShowDeleteConfirm(false)
        }}
        hasActiveLease={currentLease?.status === 'active'}
      />

      <LeaseDialog
        open={showLeaseDialog}
        onOpenChange={setShowLeaseDialog}
        tenantId={tenant.id}
      />
    </>
  )
}