import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface PaymentActionButtonProps {
  tenantId?: string
  leaseId?: string
}

export function PaymentActionButton({ tenantId, leaseId }: PaymentActionButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (leaseId) {
      navigate(`/agence/apartment-leases/${leaseId}/payments`)
    } else if (tenantId) {
      navigate(`/agence/apartment-tenants/${tenantId}/payments`)
    }
  }

  if (!tenantId && !leaseId) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      title="Gérer les paiements"
    >
      <CreditCard className="h-4 w-4" />
    </Button>
  )
}