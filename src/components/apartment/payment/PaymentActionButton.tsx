import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface PaymentActionButtonProps {
  tenantId?: string
  leaseId?: string
}

export function PaymentActionButton({ tenantId }: PaymentActionButtonProps) {
  const navigate = useNavigate()

  if (!tenantId) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(`/agence/apartment-tenants/${tenantId}/payments`)}
      title="Gérer les paiements"
    >
      <CreditCard className="h-4 w-4" />
    </Button>
  )
}