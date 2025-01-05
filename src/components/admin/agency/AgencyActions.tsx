import { Button } from "@/components/ui/button"
import { Ban, Edit, Building2, Trash2, UserPlus } from "lucide-react"
import { Agency } from "./types"

interface AgencyActionsProps {
  agency: Agency
  onEdit: () => void
  onAddProfile: () => void
  onViewOverview: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

export function AgencyActions({
  agency,
  onEdit,
  onAddProfile,
  onViewOverview,
  onToggleStatus,
  onDelete
}: AgencyActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewOverview}
      >
        <Building2 className="h-4 w-4 mr-2" />
        Vue d'ensemble
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddProfile}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Ajouter un profil
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant={agency.status === 'active' ? 'destructive' : 'outline'}
        size="sm"
        onClick={onToggleStatus}
      >
        <Ban className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}