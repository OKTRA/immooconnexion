import { Button } from "@/components/ui/button"
import { Building2, Edit, Trash2, CreditCard, Ban, ShieldCheck } from "lucide-react"

interface AgencyActionsProps {
  onEditClick: () => void
  onOverviewClick: () => void
  onDeleteClick: () => void
  onPlanClick: () => void
  onStatusClick: () => void
  status: string
}

export function AgencyActions({ 
  onEditClick, 
  onOverviewClick, 
  onDeleteClick,
  onPlanClick,
  onStatusClick,
  status
}: AgencyActionsProps) {
  const isBlocked = status === 'blocked'
  
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onOverviewClick}
      >
        <Building2 className="h-4 w-4 mr-2" />
        Vue d'ensemble
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onPlanClick}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Plan
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onStatusClick}
        className={isBlocked ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}
      >
        {isBlocked ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <Ban className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDeleteClick}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}