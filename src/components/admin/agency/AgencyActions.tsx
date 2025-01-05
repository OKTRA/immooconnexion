import { Button } from "@/components/ui/button"
import { Building2, Edit, Trash2, CreditCard } from "lucide-react"
import { Agency } from "./types"

interface AgencyActionsProps {
  onEditClick: () => void
  onOverviewClick: () => void
  onDeleteClick: () => void
  onPlanClick: () => void
}

export function AgencyActions({ 
  onEditClick, 
  onOverviewClick, 
  onDeleteClick,
  onPlanClick
}: AgencyActionsProps) {
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