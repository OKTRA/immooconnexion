import { Button } from "@/components/ui/button"
import { Edit, Lock, LockOpen, Trash2, Building2, Eye } from "lucide-react"

interface AgencyActionsProps {
  onEditClick: () => void
  onOverviewClick: () => void
  onDeleteClick: () => void
  onPlanClick: () => void
  onBlockClick: () => void
  isBlocked: boolean
}

export function AgencyActions({ 
  onEditClick, 
  onOverviewClick, 
  onDeleteClick, 
  onPlanClick,
  onBlockClick,
  isBlocked
}: AgencyActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onEditClick}
        title="Modifier"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onOverviewClick}
        title="Aperçu"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPlanClick}
        title="Plan"
      >
        <Building2 className="h-4 w-4" />
      </Button>
      <Button
        variant={isBlocked ? "outline" : "destructive"}
        size="icon"
        onClick={onBlockClick}
        title={isBlocked ? "Débloquer" : "Bloquer"}
      >
        {isBlocked ? (
          <LockOpen className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}