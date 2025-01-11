import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, Receipt, CreditCard, ClipboardList, FileCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { TenantReceipt } from "@/components/tenants/TenantReceipt"

interface TenantActionButtonsProps {
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    agency_fees?: number;
    profession?: string;
  };
  currentLease?: {
    id: string;
    status: string;
    rent_amount: number;
    deposit_amount?: number;
  };
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
  const [showReceipt, setShowReceipt] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voir les détails</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modifier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReceipt(true)}
            >
              <Receipt className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reçu de paiement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/agence/apartments/tenants/${tenant.id}/payments`)}
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paiements</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/agence/apartments/tenants/${tenant.id}/leases`)}
            >
              <ClipboardList className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Contrats</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {currentLease?.status === 'active' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onInspection}
              >
                <FileCheck className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>État des lieux</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Supprimer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reçu de paiement</DialogTitle>
          </DialogHeader>
          <TenantReceipt 
            tenant={{
              first_name: tenant.first_name,
              last_name: tenant.last_name,
              phone_number: tenant.phone_number || '',
              agency_fees: tenant.agency_fees,
              profession: tenant.profession
            }}
            lease={currentLease}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}