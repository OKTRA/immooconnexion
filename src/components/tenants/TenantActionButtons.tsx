import { Button } from "@/components/ui/button"
import { FileText, Printer, ClipboardCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TenantActionButtonsProps {
  tenant: {
    id: string
    nom: string
    prenom: string
    telephone: string
    fraisAgence?: string
  }
  onPrintReceipt: () => void
  onPrintContract: () => void
  onInspection: () => void
}

export function TenantActionButtons({ 
  tenant, 
  onPrintReceipt, 
  onPrintContract,
  onInspection 
}: TenantActionButtonsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => navigate(`/locataires/${tenant.id}/contrats`)}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">Contrats</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onPrintReceipt}
      >
        <Printer className="h-4 w-4" />
        <span className="hidden md:inline">Reçu</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onPrintContract}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">Imprimer Contrat</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onInspection}
      >
        <ClipboardCheck className="h-4 w-4" />
        <span className="hidden md:inline">Inspection</span>
      </Button>
    </div>
  )
}